"use client";
// 유래: docs/research/beautified/098-la-ts0ea1.js 모달(ec) 이식 — 브라우저 실측 구조 + 원본 클래스명.
// 트랜지션: useTransition {opacity, scale, blur(백드롭 backdropFilter px)} config {tension:280, friction:30}.
//
// 위키 v2 — 시각 구조(modal-top/modal-body/modal-meta-row/modal-actions/modal-section 등)는 재사용하되
// 콘텐츠를 getlayers 제품 개념(카피 판매·다운로드 쿼터·Premium 잠금·Discord 커뮤니티·FAQ)에서
// 위키 항목 상세(정의·왜/근거·적용·팔레트·폰트·대표작·출처·연결항목)로 전면 교체했다.
// 제거한 것: Copy prompt/Download source(쿼터·잠금 포함), Commercial licence 툴팁, FAQ 아코디언,
// Discord CTA — 전부 getlayers 특유 개념이라 위키에 대응물이 없음(완료 보고의 Deviations 참조).

import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { animated, useTransition } from "@react-spring/web";
import type { Project, WikiArtwork, WikiFont, WikiPaletteColor, WikiRelated, WikiSource } from "@/lib/types";
import { SPRING } from "@/lib/springs";
import { useScrollStore } from "@/stores/scroll";
import { useToast } from "@/stores/toast";
import { likesDisplay, useLikes } from "@/stores/likes";
import { DOMAIN_LABELS } from "@/lib/wiki-meta";
import CredibilityBadge from "@/components/library/CredibilityBadge";
import WikiMedia from "@/components/library/WikiMedia";
import { BookmarkIcon } from "@/components/library/Icons";
import InstructionsSteps from "./InstructionsSteps";
import { copyText } from "./clipboard";
import { buildDefinitionText, type InstructionStep } from "./content";
import { CloseIcon, CopyIcon, LinkIcon } from "./icons";

export interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  /** 연결 항목(related) 칩 클릭 — 모달을 닫지 않고 해당 항목으로 전환 */
  onNavigate: (id: string) => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function ProjectModal({ project, onClose, onNavigate }: ProjectModalProps): JSX.Element {
  const setEnableScroll = useScrollStore((s) => s.setEnableScroll);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    useLikes.getState().hydrate();
  }, []);

  // 원본: 열림 동안 isEnableScroll=false + Escape 닫기, cleanup에서 복원 보장
  useEffect(() => {
    if (!project) return;
    setEnableScroll(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setEnableScroll(true);
      window.removeEventListener("keydown", onKey);
    };
  }, [project, onClose, setEnableScroll]);

  useEffect(() => {
    if (!project) return;
    const raf = requestAnimationFrame(() => panelRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [project]);

  const trapFocus = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;
    if (e.shiftKey) {
      if (active === first || active === panel) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // 원본 실측: from {0, .94, blur 0} → enter {1, 1, blur 10} → leave {0, .96, blur 0}, {tension:280, friction:30}
  const transitions = useTransition(project, {
    from: { opacity: 0, scale: 0.94, blur: 0 },
    enter: { opacity: 1, scale: 1, blur: 10 },
    leave: { opacity: 0, scale: 0.96, blur: 0 },
    config: SPRING.modal,
  });

  return transitions((style, item) =>
    item ? (
      <animated.div
        className="modal-backdrop"
        style={{
          opacity: style.opacity,
          backdropFilter: style.blur.to((v) => `blur(${v}px)`),
          WebkitBackdropFilter: style.blur.to((v) => `blur(${v}px)`),
        }}
        onClick={onClose}
      >
        <animated.button
          type="button"
          className="glass modal-close-mobile"
          style={{ opacity: style.opacity }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          aria-label="Close"
        >
          <CloseIcon />
        </animated.button>
        <animated.div
          className="modal-panel modal-panel-wide"
          data-lenis-prevent
          style={{ opacity: style.opacity, transform: style.scale.to((v) => `scale(${v})`) }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={trapFocus}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          tabIndex={-1}
          ref={(el: HTMLDivElement | null) => {
            if (el) panelRef.current = el;
          }}
        >
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
          <ModalContent project={item} onClose={onClose} onNavigate={onNavigate} />
        </animated.div>
      </animated.div>
    ) : null
  );
}

/* ---------------------------------------------------------------- */

function ModalContent({
  project,
  onClose,
  onNavigate,
}: {
  project: Project;
  onClose: () => void;
  onNavigate: (id: string) => void;
}): JSX.Element {
  const show = useToast((s) => s.show);
  const toggleBookmark = useLikes((s) => s.toggle);
  const bookmarked = useLikes((s) => !!s.liked[project.id]);

  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);
  useEffect(() => {
    if (!linkCopied) return;
    const t = setTimeout(() => setLinkCopied(false), 1600);
    return () => clearTimeout(t);
  }, [linkCopied]);

  const handleCopyDefinition = async () => {
    const ok = await copyText(buildDefinitionText(project));
    if (!ok) {
      show("복사에 실패했어요 — 다시 시도해주세요.");
      return;
    }
    setCopied(true);
    show("정의를 복사했어요");
  };

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/?layer=${project.id}`;
    const ok = await copyText(url);
    if (ok) {
      setLinkCopied(true);
      show("링크를 복사했어요");
    }
  };

  const handleShowAll = () => {
    onClose();
    requestAnimationFrame(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const d = project.detail;
  const metaBits = [project.year, project.period, project.origin, project.field].filter(Boolean);

  return (
    <>
      <div className="modal-top">
        <HeroMedia project={project} />
        <div className="modal-body">
          {/* ① 위치 브레드크럼 — 도메인 › 카테고리(사용자 반려 2026-07-16: 위치 표시 추가) */}
          <p className="text-sm text-ink-faint" style={{ marginBottom: ".35rem" }}>
            {DOMAIN_LABELS[project.category]} <span aria-hidden="true">›</span> {project.categoryLabel}
          </p>
          {/* ② 뱃지행 — 정설성 + 연도/시기 메타 */}
          <div className="modal-meta-row">
            <CredibilityBadge credibility={project.credibility} />
            {metaBits.length > 0 && <span className="modal-license">{metaBits.join(" · ")}</span>}
          </div>

          {/* ③ 제목 (+ 원어 표기) */}
          <h2 className="modal-title">{project.title}</h2>
          {project.titleEn && project.titleEn !== project.title && (
            <p className="modal-desc" style={{ marginTop: "-.3rem" }}>
              {project.titleEn}
            </p>
          )}

          {/* ④ 한줄정의 */}
          <p className="modal-desc">{project.description}</p>

          {/* ⑤ 액션행 — 정의 복사 / 내 보드(북마크) / 링크 복사 */}
          <div className="modal-actions">
            <button type="button" className="modal-btn modal-btn-secondary" onClick={handleCopyDefinition}>
              <CopyIcon />
              {copied ? "복사됨!" : "정의 복사"}
            </button>
            <span className="modal-action-wrap">
              <button
                type="button"
                className={`modal-like ${bookmarked ? "modal-like-on" : ""}`}
                onClick={() => toggleBookmark(project.id)}
                aria-label="내 보드에 저장"
                aria-pressed={bookmarked}
              >
                <BookmarkIcon filled={bookmarked} />
                <span className="modal-like-count">{likesDisplay(project.likes, bookmarked)}</span>
              </button>
              <span className="action-tip" role="tooltip">
                내 보드에 저장
              </span>
            </span>
            <span className="modal-action-wrap">
              <button
                type="button"
                className="modal-icon-btn"
                onClick={handleCopyLink}
                aria-label="이 항목 링크 복사"
              >
                <LinkIcon />
              </button>
              <span className="action-tip" role="tooltip">
                {linkCopied ? "복사됨!" : "이 항목 링크 복사"}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ⑥ 태그 — 도메인·카테고리·키워드 */}
      <div className="modal-section">
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          {[...project.tags, ...project.keywords].map((tag, i) => (
            <li key={`${tag}-${i}`} className="card-tag">
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* 정의 본문(desc가 한줄정의와 다를 때만) */}
      {d.desc && d.desc !== project.description && (
        <Section title="정의">
          <p className="modal-faq-answer">{d.desc}</p>
        </Section>
      )}

      {/* 작동방식 — aesthetics의 why(왜 성립하는가) 또는 frontend의 how(어떻게 동작하는가).
          근거(rationale, creative-strategy)와는 별개 섹션으로 분리(정의→근거→적용 순서 유지). */}
      {(d.why || d.how) && (
        <Section title="작동방식">
          <p className="modal-faq-answer">{d.why || d.how}</p>
        </Section>
      )}

      {/* 근거 — creative-strategy의 rationale */}
      {d.rationale && (
        <Section title="근거">
          <p className="modal-faq-answer">{d.rationale}</p>
        </Section>
      )}

      {/* 적용 — 원본 InstructionsSteps(5스텝 카드) 재사용 */}
      {d.apply && d.apply.length > 0 && (
        <div className="modal-section">
          <InstructionsSteps
            title="어떻게 적용할까"
            subtitle="실무에 옮기는 팁"
            steps={d.apply.map((text, i): InstructionStep => ({ title: `적용 팁 ${i + 1}`, text }))}
          />
        </div>
      )}

      {/* 팔레트 스와치 */}
      {d.palette && d.palette.length > 0 && (
        <Section title="팔레트">
          <PaletteSwatches palette={d.palette} />
        </Section>
      )}

      {/* 폰트 미리보기 */}
      {d.fonts && d.fonts.length > 0 && (
        <Section title="폰트 미리보기">
          <FontPreview fonts={d.fonts} sampleText={project.title} />
        </Section>
      )}

      {/* 대표작 이미지 */}
      {d.artworks && d.artworks.length > 0 && (
        <Section title="대표작">
          <ArtworkGallery artworks={d.artworks} />
        </Section>
      )}

      {/* 출처 */}
      {d.sources && d.sources.length > 0 && (
        <Section title="출처">
          <SourceList sources={d.sources} />
        </Section>
      )}

      {/* 연결 항목 */}
      {project.related.length > 0 && (
        <Section title="연결 항목">
          <RelatedChips related={project.related} onNavigate={onNavigate} />
        </Section>
      )}

      <div className="modal-section">
        <button type="button" className="modal-btn modal-btn-secondary" onClick={handleShowAll}>
          전체 목록 보기
        </button>
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="modal-section">
      <p className="modal-section-title">{title}</p>
      {children}
    </div>
  );
}

function PaletteSwatches({ palette }: { palette: WikiPaletteColor[] }) {
  return (
    <ul className="wiki-palette" aria-label="Palette">
      {palette.map((color) => (
        <li key={color.hex} className="wiki-swatch" title={`${color.name} · ${color.hex}`}>
          <span className="wiki-swatch-chip" style={{ background: color.hex }} aria-hidden="true" />
          <span className="wiki-swatch-label">{color.name}</span>
        </li>
      ))}
    </ul>
  );
}

/** Google Fonts 요청은 layout.tsx가 lib/wiki-google-fonts.json으로 한 번에 로드 — 굵기 접미(Light/Thin 등)는
 *  별도 패밀리가 아니므로 기본 패밀리명으로 정규화해서 적용한다 */
function normalizeFontFamily(name: string): string {
  return name.replace(/\s+(Light|Thin|Regular|Medium|SemiBold|Bold|Black)$/i, "").trim();
}

function FontPreview({ fonts, sampleText }: { fonts: WikiFont[]; sampleText: string }) {
  return (
    <div className="wiki-fonts">
      {fonts.map((font) => (
        <div key={font.name} className="wiki-font-row">
          <p className="wiki-font-sample" style={{ fontFamily: `'${normalizeFontFamily(font.name)}', serif` }}>
            {sampleText}
          </p>
          <p className="wiki-font-caption">
            {font.name}
            {font.note ? ` — ${font.note}` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

function ArtworkGallery({ artworks }: { artworks: WikiArtwork[] }) {
  return (
    <ul className="wiki-gallery">
      {artworks.slice(0, 6).map((art) => (
        <li key={art.src} className="wiki-gallery-item">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={art.src} alt={art.title} loading="lazy" />
          <span className="wiki-gallery-caption">
            {art.title}
            {art.artist ? ` · ${art.artist}` : ""}
            {art.year ? ` (${art.year})` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SourceList({ sources }: { sources: WikiSource[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {sources.map((source) => (
        <li key={source.url}>
          <a className="footer-social" href={source.url} target="_blank" rel="noopener noreferrer">
            {source.label}
            <span aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function RelatedChips({ related, onNavigate }: { related: WikiRelated[]; onNavigate: (id: string) => void }) {
  return (
    <div className="recently-viewed-row">
      {related.map((rel) => (
        <button
          key={rel.id}
          type="button"
          className="recently-viewed-chip"
          title={`${rel.title} · ${DOMAIN_LABELS[rel.domain]}`}
          onClick={() => onNavigate(rel.id)}
        >
          {rel.title}
        </button>
      ))}
    </div>
  );
}

/** ① 상단 미디어 — WikiMedia(svg/html/img)로 통일. New 뱃지는 원본 로직상 위키 콘텐츠엔 상시 false. */
function HeroMedia({ project }: { project: Project }): JSX.Element {
  return (
    <div className="modal-hero">
      <WikiMedia project={project} />
    </div>
  );
}
