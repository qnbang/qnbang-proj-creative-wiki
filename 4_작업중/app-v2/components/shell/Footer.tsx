"use client";

// 유래: docs/research/index_pretty.html 1481~1553행 푸터 마크업 이식
// 위키 v2 변경점: SubscribeForm(뉴스레터 CTA)·Pricing/Contact/About·textura 소셜 링크·
// Cookie preferences 버튼과 Privacy/Terms/Cookie Policy 스텁 링크(원본 법무 고지, 대응물 없음) 전부 제거.
// Library→"전체 보기", 브랜드 태그라인·저작권 문구를 위키 콘텐츠로 교체. 로고도 Header와 동일한
// 이중 원+중심점 마크(favicon과 통일)로 교체 — 원본 3겹 마름모 그라디언트는 브랜드 잔재라 제거.

function Logo() {
  return (
    <span className="logo ">
      <svg className="logo-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
        <circle cx="14" cy="14" r="10" stroke="var(--text-primary)" strokeWidth="2.2" />
        <circle cx="14" cy="14" r="3.2" fill="var(--accent-warm-1)" />
      </svg>
      <span className="logo-word">
        <span className="logo-word-dim">크리에이티브</span>인덱스
      </span>
    </span>
  );
}

// 원본 서브페이지 링크(About/Pricing/Contact/법적 고지 스텁)는 전부 무관 항목이라 제거
const FOOTER_LINKS = [{ label: "전체 보기", href: "/#projects" }];

export default function Footer() {
  return (
    <footer className="relative z-10 w-full px-4 pb-10">
      <div className="glass flex flex-col gap-8 rounded-[var(--radius-card)] p-8">
        <div className="flex flex-col gap-9 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-base text-ink-faint">
              미감·양식·타이포·전략·프론트엔드 — 창작에 필요한 개념 381개를 한 곳에 모은 인덱스.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Footer">
            {FOOTER_LINKS.map((link) => (
              <a key={link.label} className="nav-link px-0 py-0" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-base text-ink-faint">© 2026 크리에이티브 인덱스</p>
        </div>
      </div>
    </footer>
  );
}
