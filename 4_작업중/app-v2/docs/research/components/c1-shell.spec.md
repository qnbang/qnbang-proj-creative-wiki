# C1 — 셸 스펙 (components/shell/ 전부)

## 산출 파일 (components/shell/ 밖 생성 금지)
ScrollLayout · Header(모바일 메뉴 포함) · PromoBanner · NavigationProgress · Loader · MeshBackdrop · Footer(+SubscribeForm) · CookieBanner · Toaster · AdaptiveGrid — 전부 `.tsx`, default export, props 없음

## 원본 참조
- 마크업/클래스: `docs/research/index_pretty.html` (헤더·히어로 주변·푸터·로더 부분)
- 로직: `docs/research/beautified/0gqnb4z11xdb6.js`(ScrollLayout·Header·Loader·NavigationProgress·PromoBanner·Toaster·AdaptiveGrid), `0eyuznej1vvzm.js`(MeshBackdrop), `13m583hpf-38s.js`(SubscribeForm), `0ru9lekhq5wzu.js`(Cookie)
- 클래스는 B1이 이식하는 원본 클래스명 그대로 사용(.glass-header·.header-bar·.loader 등) + Tailwind 유틸(원본 마크업의 유틸 그대로).

## 동작 규정 (원본 실측)
- **ScrollLayout**: div.scroll-layout>div.scroll-layout-content 래핑. useScrollStore.isEnableScroll=false → html `position:relative;overflow:hidden;height:100%` + true 복원. 동일경로 `#hash` 앵커 클릭 인터셉트 → `scrollIntoView({behavior:"smooth"})` (Lenis는 원본 휴면 — 미도입 확정). 마운트 시 scrollTo(0,0).
- **Header**: fixed, `top:var(--promo-height,0px)`, opacity 0→1 페이드({tension:130,friction:21}, Loader 완료 후). grid-cols-[auto_1fr_auto] md:grid-cols-[1fr_auto_1fr]. 로고(3겹 마름모 SVG — index_pretty에서 복사)+워드마크 / nav.glass.glass-header 4링크(Library `/#projects` active·About·Pricing·Contact us — 서브페이지는 `href="#"` 스텁) / Sign in / md 미만 버거 → 모바일 메뉴: useTransition {opacity:0,y:-18,blur:0}→{1,0,12}→leave{0,-10,0} {tension:280,friction:28}, 열리면 setEnableScroll(false).
- **PromoBanner**: 최상단 fixed z-55, height var(--promo-height). "Early Access Sale — $759 now $139 — HH:MM:SS left" 카운트다운(자정까지 남은 시간으로 mock, 1s tick). html에 `--promo-height:2.4rem` 세팅(언마운트 시 0px).
- **NavigationProgress**: div.nav-progress>.nav-progress-fill. a[href^="/"] 클릭 감지 → width 0→88% duration 1100 → (라우트 이벤트 대신) 600ms 후 100% {tension:320,friction:26} → 320ms 후 리셋.
- **Loader**: sessionStorage "gl-loaded" 있으면 즉시 markComplete·비표시. 없으면 1600ms 후 useTransition leave {opacity:0} {tension:220,friction:30} → markComplete + sessionStorage 기록. 마크업 div.loader>.loader-border+.loader-center(로고 scale 1.4).
- **MeshBackdrop**: fixed inset-0 z-0 pointer-events-none. `import { MeshGradient } from "@paper-design/shaders-react"` — `colors:["#0c0d10","#06070a","#06070a","#2e333d","#586575"] speed:.18 distortion:.95 swirl:.18 grainOverlay:.04 style {width:"100%",height:"100%"}`. IO 2중: 진입 rootMargin 50%에서 마운트, 이탈 100%에서 언마운트. 마운트 후 rAF 2프레임 뒤 opacity 스프링 {tension:120,friction:28} 페이드인. 정적 모드면 미표시 가능(useIsStaticMode).
- **Footer**: index_pretty 푸터 마크업 이식 — glass 카드: 로고+태그라인 / footer-social 2링크 / SubscribeForm("Fresh prompts, every Friday.") / nav 7링크+Cookie preferences 버튼 / © 2026 getlayers · textura.agency.
- **SubscribeForm**: 이메일 검증 + 일회용 도메인 차단 + 주요 도메인 오타 Levenshtein(≤2) 교정 제안("Did you mean ...?") — 원본 로직 이식(13m583hpf). 제출은 mock: 성공 토스트(useToast).
- **CookieBanner**: localStorage "cookie-consent-v1" 없으면 표시. Accept all/Reject all/Manage preferences(간단 모달). 원본 특이점 재현: acceptAll도 {analytics:false,marketing:false} 저장.
- **Toaster**: useToast 구독, useTransition {opacity:0,y:16} {tension:300,friction:26}, 3400ms 자동 소멸(스토어가 담당).
- **AdaptiveGrid**: children 없음(전역 이펙트) — innerWidth>1920일 때 html font-size = 16*(1+((w-1920)/1920)*.6666)px 세팅(원본: base 1920, coef .6666, >16px일 때만), resize 디바운스.

## 품질
- "use client" 전부. Spring/Hover/BorderGlow/useIsStaticMode/스토어는 CONTRACTS 시그니처로 import(파일이 아직 없어도 계약대로 — 통합 시 tsc 검증).
