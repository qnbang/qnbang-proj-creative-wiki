# B1 — CSS 이식 스펙

## 산출 파일 (이 2개만 생성, 다른 파일 금지)
- `app/fonts.css`
- `app/components.css`

## 입력(원본)
- `source/_next/static/chunks/0u2jgac~8gzq6.css` (5KB — 폰트 @font-face)
- `source/_next/static/chunks/0x0j-38nivi5q.css` (121KB — 메인)
- 클래스 사용처 대조: `docs/research/index_pretty.html`

## fonts.css 요구
- 원본 @font-face 전부 이식하되 URL을 `/fonts/<파일명>`으로 치환(쿼리 `?dpl=` 제거). 폰트 파일은 `public/fonts/`에 이미 있음(파일명 동일).
- unicode-range·font-display·size-adjust 폴백(@font-face Fallback) 등 원본 속성 그대로.
- `:root { --font-onest: ...; --font-general: ...; }` — 원본 next/font 변수 체계를 수동 재현. body에 폰트 변수 클래스가 없으므로 `--font-onest`/`--font-general`을 실제 패밀리명으로 직접 정의.

## components.css 요구
- 원본 121KB CSS에서 **Tailwind 생성 유틸리티가 아닌 것 전부** 이식:
  1) `:root` 디자인 토큰 전부(색·glass·radius·--header-height·--promo-height 등)
  2) base 규칙(html/body 배경·color-scheme·selection 등)
  3) 커스텀 컴포넌트 클래스 전부 — .glass계·.btn계(btn-silver/accent/secondary/with-icon/btn-label/btn-icon-circle)·.border-glow계(+variant 4종 크기)·.pill/.eyebrow-dot·.hero-*(region/stage/content/title/title-accent/subtitle/scene)·.section-title·.projects-fresh-pill·.filter-*(panel/tab/tab-active/tab-v/sidebar/float-wrap/count/locked/nav-tooltip)·.dropdown계·.project-card/.card-*(thumb/thumb-img/thumb-video/titlerow/title/arrow/tag/new-badge계)·.likes-pill/.heart-icon·.tier-badge계/.badge-tooltip·.scene-overlay계·.grid-card-reveal/.banner-card-padding·.subscribe계·.hire-us-card계·.go-card계·.modal-*(backdrop/panel/panel-wide 등)·.loader계(+@property --loader-angle+@keyframes loader-border-spin)·.nav-progress계·.header-*(bar/logo-tile/burger/account)·.glass-header·.mobile-menu계·.footer계·.toast계·.promo-banner계·.textura-link·.logo계·기타 발견분
  4) `data-render-mode="static"` 무효화 규칙·모바일(@media max-width:767px 등) 오버라이드·(hover:hover) 가드
- Tailwind 유틸(`.flex`, `.pb-28`, `.aspect-\[960\/684\]` 등)은 **이식 금지** — 마크업이 Tailwind v4로 재생성.
- `--tw-*` 변수에 의존하는 원본 선언은 의존 제거하거나 값 인라인(이식분은 Tailwind 레이어 밖 plain CSS).
- 섹션 주석으로 구획 정리(사람이 읽는 파일). 값은 원본 그대로 — 재해석 금지.

## 검증
- 두 파일이 plain CSS로 문법 오류 없이 파싱(빈 url()·잘린 셀렉터 없음).
- 이식 누락 목록을 최종 리포트에 명시(있다면).
