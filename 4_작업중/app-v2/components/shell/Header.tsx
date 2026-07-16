"use client";

import { useEffect, useState } from "react";
import { animated, useTransition } from "@react-spring/web";
import Spring from "@/components/motion/Spring";
import { SPRING } from "@/lib/springs";
import { useLoaderState } from "@/stores/loader";
import { useScrollStore } from "@/stores/scroll";
import { DOMAIN_ORDER, DOMAIN_LABELS } from "@/lib/wiki-meta";
import { useFilterStore } from "@/stores/filter";
import type { FilterKey } from "@/lib/types";

// 유래: docs/research/beautified/0gqnb4z11xdb6.js 모듈 39420 (HomeHeader)
// 마크업: docs/research/index_pretty.html 102~174행
// 위키 v2 변경점: 원본 NAV_LINKS(Library/About/Pricing/Contact us — Pricing·Contact는 무관 항목이라 제거)를
// 도메인 5개 퀵필터로 교체. 클릭 시 stores/filter(useFilterStore)로 ProjectsGrid의 활성 필터를 바로 바꾸고
// #projects로 스크롤한다. 인증(useAuth)·구독 상태 분기·Sign in 링크는 클론 스텁조차 없이 제거(무관 항목).
//
// TODO(차단됨, 사용자 직접 승인 대기): 이 nav.glass.glass-header 캡슐에 shuding/liquid-glass 굴절 필터를
// 적용하는 작업 지시가 있었으나, 외부 리포 코드를 앱에 통합하는 조작이라 권한 시스템이 자동 거부했다
// (코디네이터 릴레이 지시만으로는 불충분 — 사용자 본인의 명시적 승인 필요, 완료 보고 참조). 승인되면 이
// nav 엘리먼트에 ref를 달고 클라이언트 컴포넌트로 backdrop-filter를 교체하면 된다.

interface DomainLink {
  key: FilterKey;
  label: string;
}

const NAV_LINKS: DomainLink[] = [
  { key: "all", label: "전체" },
  ...DOMAIN_ORDER.map((key) => ({ key, label: DOMAIN_LABELS[key] })),
];

/** 이중 원 + 중심점 마크 — favicon(site/index.html data URI)과 동일한 아이덴티티.
 *  원본 getlayers 3겹 마름모 그라디언트 로고는 브랜드 잔재라 교체(그라디언트 id 처리도 불필요해져 단순화). */
function Logo({ showWordmark = true }: { showWordmark?: boolean }) {
  return (
    <span className="logo ">
      <svg className="logo-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
        <circle cx="14" cy="14" r="10" stroke="var(--text-primary)" strokeWidth="2.2" />
        <circle cx="14" cy="14" r="3.2" fill="var(--accent-warm-1)" />
      </svg>
      {showWordmark && (
        <span className="logo-word">
          <span className="logo-word-dim">크리에이티브</span>인덱스
        </span>
      )}
    </span>
  );
}

const BurgerIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default function Header() {
  const complete = useLoaderState((s) => s.complete);
  const setEnableScroll = useScrollStore((s) => s.setEnableScroll);
  const filter = useFilterStore((s) => s.filter);
  const setFilter = useFilterStore((s) => s.setFilter);
  const [menuOpen, setMenuOpen] = useState(false);

  // 메뉴 열림 동안 스크롤 잠금 + Escape 닫기 (원본 이펙트)
  useEffect(() => {
    if (!menuOpen) return;
    setEnableScroll(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      setEnableScroll(true);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, setEnableScroll]);

  const menuTransition = useTransition(menuOpen, {
    from: { opacity: 0, y: -18, blur: 0 },
    enter: { opacity: 1, y: 0, blur: 12 },
    leave: { opacity: 0, y: -10, blur: 0 },
    config: SPRING.mobileMenu, // {280, 28}
  });

  const gotoDomain = (key: FilterKey) => {
    setFilter(key);
    setMenuOpen(false);
    requestAnimationFrame(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <>
      {/* 초기 opacity 0 → 로더 완료(complete) 후 페이드인 {130,21} */}
      <Spring
        tag="header"
        mode="once"
        from={{ opacity: 0 }}
        to={{ opacity: 1 }}
        config={SPRING.headerFade}
        enabled={complete}
        className="fixed inset-x-0 top-[var(--promo-height,0px)] z-50 grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3.5 md:grid-cols-[1fr_auto_1fr] md:gap-4"
      >
        <div className="header-bar" aria-hidden="true" />
        <a aria-label="크리에이티브 인덱스 — home" className="relative justify-self-start" href="/">
          <span className="glass header-logo-tile md:hidden">
            <Logo showWordmark={false} />
          </span>
          <span className="hidden md:inline-flex">
            <Logo />
          </span>
        </a>
        <nav
          className="glass glass-header relative hidden items-center gap-0.5 rounded-[var(--radius-pill)] px-1.5 py-1.5 md:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.key}
              type="button"
              className={`nav-link ${filter === link.key ? "nav-link-active" : ""}`}
              aria-current={filter === link.key ? "page" : undefined}
              onClick={() => gotoDomain(link.key)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="md:hidden" aria-hidden="true" />
        <div className="md:hidden" aria-hidden="true" />
        <button
          type="button"
          className="glass header-burger relative justify-self-end md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <CloseIcon /> : <BurgerIcon />}
        </button>
      </Spring>

      {menuTransition((style, open) =>
        open ? (
          <>
            <animated.div
              className="mobile-menu-backdrop md:hidden"
              style={{
                opacity: style.opacity,
                backdropFilter: style.blur.to((b) => `blur(${b}px)`),
                WebkitBackdropFilter: style.blur.to((b) => `blur(${b}px)`),
              }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />
            <animated.div
              className="mobile-menu-stack md:hidden"
              style={{ opacity: style.opacity, transform: style.y.to((y) => `translateY(${y}px)`) }}
            >
              <div id="mobile-menu" className="mobile-menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
                <p className="mobile-menu-section-title">도메인</p>
                <nav aria-label="Mobile">
                  <ul className="mobile-menu-list">
                    {NAV_LINKS.map((link) => (
                      <li key={link.key}>
                        <button
                          type="button"
                          className={`mobile-menu-link ${filter === link.key ? "mobile-menu-link-active" : ""}`}
                          onClick={() => gotoDomain(link.key)}
                          aria-current={filter === link.key ? "page" : undefined}
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </animated.div>
          </>
        ) : null
      )}
    </>
  );
}
