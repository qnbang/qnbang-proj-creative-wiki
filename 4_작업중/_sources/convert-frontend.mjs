// frontend-glossary-full.html의 DATA 배열 → data/frontend.json 변환 스크립트
// 재실행 가능: node convert-frontend.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, '../../3_레퍼런스/files/frontend-glossary-full.html');
const OUT = path.resolve(__dirname, '../site/data/frontend.json');

// SVG 썸네일 (id → svg 문자열, 검증 완료분)
const THUMBS = ['frontend-thumbs-1.json', 'frontend-thumbs-2.json', 'frontend-thumbs-3.json']
  .reduce((acc, f) => Object.assign(acc, JSON.parse(readFileSync(path.resolve(__dirname, f), 'utf-8'))), {});

const html = readFileSync(SRC, 'utf-8');
const m = html.match(/const DATA = (\[[\s\S]*?\]);\n\nconst esc/);
if (!m) throw new Error('DATA 배열을 찾지 못했습니다.');
// eslint-disable-next-line no-new-func
const DATA = new Function(`return ${m[1]};`)();

// en → "fe-" + 영문 케밥
function slug(en) {
  return 'fe-' + en.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// desc 첫 문장 분리("~다." 까지). 못 찾으면 첫 마침표까지, 그것도 없으면 desc 전체.
function firstSentence(desc) {
  const m1 = desc.match(/^[\s\S]*?다\./);
  if (m1) return m1[0];
  const m2 = desc.match(/^[\s\S]*?\./);
  return m2 ? m2[0] : desc;
}

// desc에서 영문 기술 토큰(대문자 포함·점/슬래시 포함 등) 추출해 키워드 후보로
function extractDescKeywords(desc, exclude) {
  const tokens = desc.match(/[A-Za-z][A-Za-z0-9.+/#-]*[A-Za-z0-9]|[A-Za-z]{2,}/g) || [];
  const seen = new Set();
  const out = [];
  for (const t of tokens) {
    if (exclude.has(t)) continue;
    if (seen.has(t)) continue;
    seen.add(t);
    out.push(t);
    if (out.length >= 3) break;
  }
  return out;
}

// 같은 카테고리 내 배열 인덱스 거리 기준으로 의미상 이웃 추정 (2~4개)
function relatedIds(cat, idx, idOf) {
  const n = cat.terms.length;
  if (n <= 1) return [];
  const others = [];
  for (let i = 0; i < n; i++) {
    if (i === idx) continue;
    others.push({ i, dist: Math.abs(i - idx) });
  }
  others.sort((a, b) => a.dist - b.dist);
  const count = Math.min(4, Math.max(2, n - 1));
  return others.slice(0, count).map((o) => idOf(cat.terms[o.i]));
}

const items = [];
DATA.forEach((cat) => {
  const idOf = (t) => slug(t.en);
  cat.terms.forEach((t, idx) => {
    const id = slug(t.en);
    const oneLiner = firstSentence(t.desc);
    const exclude = new Set([t.en, t.ko]);
    const extra = extractDescKeywords(t.desc, exclude);
    const keywords = [t.en, t.ko, ...extra];
    const detail = { desc: t.desc };
    if (t.how) detail.how = t.how;
    if (THUMBS[id]) detail.svg = THUMBS[id];
    items.push({
      id,
      domain: 'frontend',
      category: cat.name,
      categoryLabel: cat.name,
      title: t.en,
      titleEn: t.ko,
      field: '웹 개발',
      oneLiner,
      credibility: 'established',
      keywords,
      related: relatedIds(cat, idx, idOf),
      detail,
    });
  });
});

// ── 자체 검증 ──
const errors = [];
if (items.length !== 88) errors.push(`항목 수 ${items.length} !== 88`);
const idSet = new Set();
items.forEach((it) => {
  if (idSet.has(it.id)) errors.push(`id 중복: ${it.id}`);
  idSet.add(it.id);
});
items.forEach((it) => {
  (it.related || []).forEach((rid) => {
    if (!idSet.has(rid)) errors.push(`${it.id} → 존재하지 않는 related id: ${rid}`);
  });
});

const json = JSON.stringify(items, null, 2);
try {
  JSON.parse(json);
} catch (e) {
  errors.push(`JSON.parse 실패: ${e.message}`);
}

writeFileSync(OUT, json, 'utf-8');

console.log(`항목 수: ${items.length}`);
console.log(`id 중복: ${items.length - idSet.size}`);
console.log(`related 무결성 오류: ${errors.length}`);
if (errors.length) {
  console.log(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('검증 통과: JSON.parse OK, id 중복 0, related 전부 실존');
}
