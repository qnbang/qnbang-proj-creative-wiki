# C2 — 라이브러리 섹션 스펙 (components/library/ 전부)

## 산출 파일 (components/library/ 밖 생성 금지)
ProjectsGrid(메인) · ProjectCard · PosterVideo · FilterTabs · FilterSidebar · SortDropdown · SceneOverlay · BannerCards(Subscribe/HireUs/GoCard) · RecentlyViewed — 구성 자유, CONTRACTS의 필수 시그니처 준수

## 원본 참조
- 마크업/클래스: `docs/research/index_pretty.html`의 section#projects (카드 A형 8개·스켈레톤 B형·배너 C형 3종 마크업 전부 있음)
- 로직: `docs/research/beautified/098-la-ts0ea1.js` (ProjectsGrid·카드 ew·PosterVideo S·Dropdown·FilterTabs·최근 본)
- 데이터: `lib/projects.ts`의 projects(로컬 URL 완료)

## 섹션 구조 (원본)
section#projects.relative.pb-28.pt-28 → 리빌 pill + h2.section-title(BlurWords) + SortDropdown / 모바일 filter-panel 가로탭 + lg↑ sticky filter-sidebar(+RECENTLY VIEWED) / ul.grid(1→sm2→lg3 gap-1→xl4)

## 동작 규정 (원본 실측)
- **리빌**: useProgressTrigger(start "top bottom", end "top center") — progress>.02에 발동. 제목은 SpringValue(0)→1 duration 1100으로 구동해 BlurWords에 주입. pill/사이드바는 Spring(from opacity0·y14/24).
- **필터**: FilterKey 상태(all/template/3d_scene/background). 라벨·카운트 = CATEGORY_LABELS·categoryCounts(). URL 무변화. active 탭 filter-tab-active/-v-active.
- **정렬**: SortDropdown "Popular"|"Recent" — useTransition {opacity:0,scale:.95} {tension:320,friction:28}. sortProjects 사용.
- **배너 삽입**: 필터·정렬 결과 배열에 mulberry32(fnv1a(filter+sort)) — 첫 위치 1+⌊2r⌋, 간격 5+⌊3r⌋, 같은 타입 최소 30칸, 순환 [goUnlimited, hireUs, subscribe]. 마크업은 index_pretty의 C형 3종 그대로(go-card 제목 3종 로테이션 포함).
- **ProjectCard**: li#card-{id} > div.grid-card-reveal(Spring once, from y42, {tension:130,friction:24}, delayIn eager(index<8)? 55*index : 60) > article.project-card(--lift Hover 0↔1 {tension:240,friction:26}, role button) — BorderGlow card-sm·PosterVideo·card-new-badge(isNew)·likes-pill(useLikes.toggle, 클릭 시 이벤트 stopPropagation)·titlerow(arrow svg+title+tier-badge — Premium은 스파클+툴팁, Free는 텍스트)·card-tag 목록. 3d_scene/background엔 SceneOverlay(scene-overlay-hud: tag "3D Scene"/"Background"+title+desc).
- **PosterVideo**: video muted loop playsInline preload="none" disablePictureInPicture. IO threshold .1 진입 시 src 주입 → 150+rand(140)ms 후 play, 이탈 pause. poster=image webp.
- **지연 마운트**: index≥8 카드는 IO rootMargin 1200px 전까지 스켈레톤(B형 glass-card + animate-pulse)로.
- **모달 연동**: 카드 클릭/Enter → `?layer={id}` pushState + ProjectModal(project) 렌더(C3 import — `@/components/modal/ProjectModal`, props {project, onClose}). onClose → history.back 아닌 replaceState 제거. 초기 로드에 ?layer 있으면 바로 오픈. popstate 대응. 열 때 RecentlyViewed에 push(localStorage "gl-recently-viewed", 최대 10, 중복 제거 선두 삽입).
- **RecentlyViewed**: 사이드바 위 "RECENTLY VIEWED" 리스트(제목 클릭 시 모달 오픈, ↻ 초기화 버튼).

## 품질
- "use client". CONTRACTS 시그니처 준수. Spring/Hover/BorderGlow/useProgressTrigger/BlurWords/스토어는 계약대로 import(통합 시 tsc 검증).
