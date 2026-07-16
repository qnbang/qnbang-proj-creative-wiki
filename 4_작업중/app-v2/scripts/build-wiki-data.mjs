// 위키 5개 JSON(site/data/*.json) → getlayers Project 스키마(lib/projects-data.json)로 변환.
// 콘텐츠 데이터(원문 desc 등) 무수정 — 필드 재배치·라벨링만 수행.
// 실행: node scripts/build-wiki-data.mjs  (app-v2 루트에서)

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.resolve(ROOT, "../site/data");

const DOMAIN_LABELS = {
  aesthetics: "미감",
  "art-movement": "양식",
  typography: "타이포",
  "creative-strategy": "전략",
  frontend: "프론트엔드",
};

const CREDIBILITY_FALLBACK = "personal";
const VALID_CREDIBILITY = new Set(["established", "consensus", "disputed", "industry", "personal"]);

const FILES = ["aesthetics", "art-movement", "typography", "creative-strategy", "frontend"];

function loadAll() {
  const byDomain = {};
  for (const name of FILES) {
    const p = path.join(DATA_DIR, `${name}.json`);
    byDomain[name] = JSON.parse(readFileSync(p, "utf8"));
  }
  return byDomain;
}

/** 카드/모달 미디어 — svg > demo(html) > artworks[0] > gallery.images[0] > figurePortraits 첫값 > 생성 폴백 */
function pickMedia(item) {
  const d = item.detail || {};
  if (d.svg && d.svg.trim()) return { image: d.svg, imageKind: "svg" };
  if (d.demo && d.demo.trim()) return { image: d.demo, imageKind: "html" };
  if (Array.isArray(d.artworks) && d.artworks[0]?.src) return { image: d.artworks[0].src, imageKind: "img" };
  if (d.gallery?.images?.[0]) return { image: d.gallery.images[0], imageKind: "img" };
  const portraits = d.figurePortraits ? Object.values(d.figurePortraits) : [];
  if (portraits[0]) return { image: portraits[0], imageKind: "img" };
  const fallback = `<svg viewBox="0 0 560 240" xmlns="http://www.w3.org/2000/svg"><rect width="560" height="240" fill="#f4f4f1"/><text x="280" y="128" text-anchor="middle" font-size="22" fill="#222" font-family="sans-serif">${escapeXml(
    item.title,
  )}</text></svg>`;
  return { image: fallback, imageKind: "svg" };
}

function escapeXml(s) {
  return String(s).replace(/[<>&"']/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;" }[c]));
}

function main() {
  const byDomain = loadAll();
  const flat = [];
  for (const domain of FILES) {
    for (const item of byDomain[domain]) flat.push(item);
  }
  const byId = new Map(flat.map((item) => [item.id, item]));

  // 데이터 감사(2026-07-16): aesthetics.json에 id가 중복된 항목 7쌍 발견(예: "grid"가 composition·실행
  // 카테고리에 각각 다른 제목으로 존재) — 원문 콘텐츠는 무수정 원칙이라 site/data는 그대로 두고,
  // 이 어댑터가 만드는 카드/모달용 id만 두 번째 항목부터 "-2"/"-3" 접미를 붙여 React key 충돌과
  // getProject() 조회 충돌을 막는다.
  const usedIds = new Set();
  const dupLog = [];
  function uniqueId(rawId) {
    if (!usedIds.has(rawId)) {
      usedIds.add(rawId);
      return rawId;
    }
    let n = 2;
    while (usedIds.has(`${rawId}-${n}`)) n++;
    const alt = `${rawId}-${n}`;
    usedIds.add(alt);
    dupLog.push(`${rawId} -> ${alt}`);
    return alt;
  }
  // 먼저 전체 순서대로 최종 id를 확정해 raw 객체에 매달아둔다 — related 해석이 어떤 중복 항목을
  // 가리키는지(byId가 동일 raw id에 마지막에 쓴 객체를 우선하는 것)와 무관하게 최종 id를 참조하게 한다.
  for (const item of flat) item.__finalId = uniqueId(item.id);

  const uniqueFontNames = new Set();
  const projects = flat.map((item) => {
    const d = item.detail || {};
    const media = pickMedia(item);
    const credibility = VALID_CREDIBILITY.has(item.credibility) ? item.credibility : CREDIBILITY_FALLBACK;
    const domainKo = DOMAIN_LABELS[item.domain] ?? item.domain;
    const categoryLabel = item.categoryLabel || item.category || domainKo;

    const palette = Array.isArray(d.palette) && d.palette.length ? d.palette : undefined;
    const fonts = Array.isArray(d.fonts) && d.fonts.length ? d.fonts : undefined;
    if (fonts) for (const f of fonts) if (f.name) uniqueFontNames.add(f.name);

    const artworks =
      Array.isArray(d.artworks) && d.artworks.length
        ? d.artworks
        : Array.isArray(d.gallery?.images) && d.gallery.images.length
          ? d.gallery.images.slice(0, 6).map((src, i) => ({ title: `${item.title} ${i + 1}`, src }))
          : undefined;

    const related = (item.related || [])
      .map((relId) => {
        const rel = byId.get(relId);
        return rel ? { id: rel.__finalId, title: rel.title, domain: rel.domain } : null;
      })
      .filter(Boolean);

    return {
      id: item.__finalId,
      title: item.title,
      titleEn: item.titleEn || undefined,
      category: item.domain,
      categoryLabel,
      origin: item.origin || undefined,
      year: typeof item.year === "number" ? item.year : undefined,
      period: item.period || undefined,
      field: item.field || undefined,
      tags: [domainKo, categoryLabel],
      stack: (item.keywords || []).slice(0, 4),
      credibility,
      // 상단 modal-desc(짧은 태그라인) 자리엔 oneLiner를 쓰고, 긴 본문은 detail.desc로 따로 둔다
      // (원본은 desc 하나뿐이라 두 자리에 같은 텍스트가 중복 표시되는 걸 피하기 위한 재배치).
      description: item.oneLiner || d.desc || "",
      image: media.image,
      imageKind: media.imageKind,
      posterVideo: "",
      posterVideoPreview: "",
      controller: undefined,
      likes: 0,
      createdAt: typeof item.year === "number" ? `${Math.min(Math.max(item.year, 1000), 2026)}-01-01` : "2020-01-01",
      keywords: item.keywords || [],
      related,
      detail: {
        desc: d.desc || undefined,
        why: d.why || undefined,
        rationale: d.rationale || undefined,
        how: d.how || undefined,
        apply: Array.isArray(d.apply) && d.apply.length ? d.apply : undefined,
        palette,
        fonts,
        artworks,
        galleryImages: undefined,
        sources: Array.isArray(d.sources) && d.sources.length ? d.sources : undefined,
      },
    };
  });

  const outPath = path.join(ROOT, "lib", "projects-data.json");
  writeFileSync(outPath, JSON.stringify(projects, null, 2), "utf8");

  // Google Fonts 요청용 정제 — 시스템 폰트(Times New Roman)·비-ASCII 오염값("Optima는 비공개이나 유사")·
  // 동일 패밀리 굵기 변형(Inter Light/Thin → Inter)을 걸러 실제 요청 가능한 패밀리명만 남긴다.
  const SYSTEM_FONTS = new Set(["Times New Roman"]);
  const sanitized = new Set();
  for (const name of uniqueFontNames) {
    if (SYSTEM_FONTS.has(name)) continue;
    if (!/^[\x00-\x7F]*$/.test(name)) continue; // 비-ASCII(한글 등) 혼입값 제외
    const base = name.replace(/\s+(Light|Thin|Regular|Medium|SemiBold|Bold|Black)$/i, "").trim();
    sanitized.add(base);
  }
  const fontsOutPath = path.join(ROOT, "lib", "wiki-google-fonts.json");
  writeFileSync(fontsOutPath, JSON.stringify([...sanitized].sort(), null, 2), "utf8");

  if (dupLog.length) {
    console.log(`id 중복 ${dupLog.length}건 감지·해소(원문 무수정, 어댑터 출력에서만 접미 부여):`);
    for (const line of dupLog) console.log("  " + line);
  }
  console.log(`wrote ${projects.length} items -> ${outPath}`);
  console.log(`wrote ${sanitized.size} unique font names -> ${fontsOutPath}`);
  const counts = {};
  for (const p of projects) counts[p.category] = (counts[p.category] || 0) + 1;
  console.log("counts per domain:", counts);
}

main();
