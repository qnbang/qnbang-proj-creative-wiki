# getlayers.ai 클론 구현 계획 (경로 1 — 원본 직접 이식)

> 2026-07-02 작성. 근거: diagnose.mjs 진단 + 원본 청크 22개 정독(에이전트 2) + 브라우저 실측.
> 원본: https://www.getlayers.ai/ (#projects = 홈의 라이브러리 섹션)
> 목적: 개인 학습용 클론 코딩(비공개 보관) — 재사용 효과는 이후 상위 `effects/`로 수동 승격.

## 0. 확보 자산 (완료)

| 자산 | 위치 | 상태 |
|---|---|---|
| SSR HTML (콘텐츠 전체) | `source/index.html` | ✅ 214KB |
| JS 청크 20개 (앱 코드 가독) | `source/_next/static/chunks/` | ✅ 라이브러리·수치·GLSL 전문 추출됨 |
| CSS 2개 (디자인 토큰·전 클래스) | `source/_next/static/chunks/*.css` | ✅ |
| 폰트 8종 (GeneralSans 4 + Onest 4) | `source/_next/static/media/` | ✅ woff2 |
| 미디어 326개 (mp4 226 + webp 87 등) | `public/{templates,3d_scenes,backgrounds}/` | ✅ 1.32GB, asset-map.json / mp4는 깃 제외 |
| 프로젝트 데이터 87건 | `docs/research/projects-data.json` | ✅ flight 스트림에서 추출 |
| 분석 리포트 | 이 문서 + DIAGNOSIS.md | ✅ |
| 매니페스트(extract-manifest) | — | ❌ 2회 행업으로 생략 (BLOCKED.md 참조) |

## 1. 확정 스택 (원본 실측 — 추측 아님)

- **Next.js 16 (App Router) + React 19 + TypeScript** — 원본과 동일 구조. 클론은 안정판(next@16.x 최신)으로.
- **Tailwind CSS v4** + 전역 시맨틱 클래스(`.glass`, `.btn`, `.project-card`…) — 원본 CSS를 거의 그대로 이식.
- **@react-spring/web** — 사이트 모션의 전부. GSAP·framer-motion 사용 안 함(원본에 없음).
- **zustand v5** — useAuth/useScroll/useToast/useSignInModal/useLoaderState 스토어.
- **three@0.158.0** — HeroScene 파티클 은하(데스크톱 ≥1280px 전용). R3F 불필요(원본이 바닐라 three).
- **@paper-design/shaders-react** — 배경 `MeshGradient` (원본이 이 패키지 원형 그대로 번들).
- **Lenis: 도입 안 함** — 실측 결과 원본에서 휴면(스토어·rAF 훅만 있고 인스턴스 미생성, 휠 즉시 점프 = 네이티브 스크롤). 앵커 이동은 `scrollIntoView({behavior:"smooth"})` 폴백만 동작. 동일하게 재현.
- 서버(백엔드) 의존은 전부 로컬 대체: 프로젝트 데이터 = `projects-data.json` 정적 import, 좋아요/쿼터 = localStorage mock, 인증 = 생략(Sign in UI만).

## 2. 페이지 구성 (원본 실측 구조)

```
RootLayout (html data-render-mode, 폰트 변수, GA 생략)
├─ NavigationProgress   상단 2px 진행바 (클릭→0→88% duration 1100 → 완료 시 100%)
├─ PromoBanner          최상단 세일 배너 + 카운트다운 (--promo-height 2.4rem)
├─ Header (fixed)       로고(3겹 마름모 SVG) · 필 내비 4링크 · Sign in · 모바일 버거
├─ MeshBackdrop         fixed inset-0 z-0, MeshGradient 셰이더 배경
├─ Loader               첫 방문 1600ms 프리로더 (conic 회전 보더, sessionStorage 'gl-loaded' 스킵)
├─ main
│  ├─ HomeHero          h 50vh — pill·타이틀·서브·CTA(BorderGlow 버튼) + HeroScene(three 은하)
│  └─ #projects 섹션    ← 핵심
│     ├─ 리빌 헤더      pill + 단어분해 BlurWords 제목 + 정렬 Dropdown(Popular/Recent)
│     ├─ 필터           모바일: 가로 filter-tab / lg↑: sticky 사이드바 filter-tab-v
│     │                 All(87)·Templates(18)·3D Scenes(52)·Backgrounds(17) + Recently viewed
│     └─ 카드 그리드    1→sm2→lg3→xl4열. 프로젝트 87 + 배너 카드 8(PRNG 삽입)
│        └─ ProjectCard 비디오 썸네일(뷰포트 자동재생)·BorderGlow·--lift 호버·likes·NEW 뱃지
│                        3d_scene/background엔 scene-overlay HUD(태그·제목·설명)
├─ 상세 모달 (?layer=slug 딥링크, useTransition scale .94→1 + blur)
│   포스터→풀 비디오·티어 뱃지·Copy prompt/Download(잠금+쿼터)·좋아요·공유·태그
│   Instructions 스텝·controller 섹션(3d_scene)·FAQ 아코디언·related
├─ Footer               glass 카드 — 로고·소셜·SubscribeForm(오타교정)·내비·법적 링크
└─ Cookie 배너 + Toaster
```

## 3. 이식할 핵심 메커니즘 (원본 수치 — 스펙의 근거)

### 3-1. 모션 프리미티브 (전부 자작 컴포넌트, react-spring 기반)
| 컴포넌트 | 역할 | 원본 파라미터 |
|---|---|---|
| `Spring` | 진입 리빌 래퍼 | mode always/once/forward, delayIn/Out, disableOnMobile(≤768) |
| `Hover` | 호버 스프링 | mouseenter/leave, 기본 모바일 무효 |
| `ProgressTrigger` | 스크롤 진행도 훅 (GSAP ScrollTrigger 대체 자작) | start/end "top bottom" 문법 9조합, rAF+IO, interpolatedProgress 스프링 보간 |
| `BlurWords`/`BlurBlock` | 단어 단위 blur 리빌 | blur 14/16, yOffset 12/14, rampWidth .18/.22, unrevealAt .7 |
| `BorderGlow` | 테두리 순회 글로우 블롭 2개 | t 0→1 loop duration 4200ms, 오프셋 0/0.5, 둥근사각 둘레 매개변수화, IO pause |
| `AnimatedSpark` | CTA 스파클 3개 | scale .4+.6sin(tπ), 1500ms, delay 380ms×i |
| `RenderModeProvider` | reduced-motion/webdriver→static 모드 | Globals.skipAnimation + data-render-mode |

### 3-2. CSS 변수 계약 (JS 스프링이 변수를 구동, CSS가 소비)
- `--lift` 0↔1 (카드 호버, config {tension:240,friction:26}) → card-arrow width/opacity, likes-pill opacity, glass bg 강도
- `--btn-hover` 0↔1 (버튼, {tension:220,friction:26}) → bg·inset 글로우·보더 opacity 계산식
- `--hero-drift` (포인터→히어로 radial-gradient 중심 이동)
- `--loader-angle` (@property angle, conic 회전 1.8s linear)
- 블롭 위치는 inline transform 직접 주입

### 3-3. 대표 스프링 수치 (원본 실측)
- 히어로 텍스트: {tension:110,friction:26}, y12~14, delayIn 0/90/180/270
- 카드 진입: once, y42→0, {tension:130,friction:24}, delay 55ms×i(첫 8장) / 60ms
- 모달: opacity 0/scale .94/blur 0 → 1/1/10px, {tension:280,friction:30} — 전 모달 공통
- 그리드 제목 리빌 드라이버: duration 1100, 발동 progress>.02 (start "top bottom" end "top center")
- 모바일 메뉴: y-18→0 blur 12px, {tension:280,friction:28} / 헤더 페이드 {tension:130,friction:21}
- Toaster 3400ms, {tension:300,friction:26} / Dropdown {tension:320,friction:28} / 아코디언 height {tension:230,friction:28}

### 3-4. HeroScene (three r158, 코드 이식 ~350줄)
- 렌더러 alpha+AA, pixelRatio min(dpr,1) / 카메라 fov50 z15 / Points×2(두 번째 rotation.y=π), group rot(1,-1.2,.5) scale .8
- 파티클: ≤576px 5천·≤1440 5천·그외 1만, 구면 샘플+30% 외곽 희소, 오버브라이트 팔레트 {322,324,334}/{202,204,214}/{118,120,130}
- 은하 형성: 프레임당 ≤20개 활성화, 나선 각 E+=.02, 반경 성장 v .012→.002 감쇠, used 알파 +.01/−.003 명멸
- 셰이더: MeshPhysicalMaterial onBeforeCompile 주입 — 커서 밀어내기(NDC 반경 .08, push=pow(1-d/r,2)*.14) + 페이크 블룸(core .32/halo²·.55) — GLSL 전문 확보됨(분석 리포트)
- 스크롤: progress lerp .1 → camera.z=15-5p, universeOut=.4+.6p(페이드아웃) / 마우스 lerp .12 / active=IO 토글, ≥1280px에서만 마운트
- **원본 대비 부하 주의**: dpr 캡 1·파티클 1만은 원본 그대로 유지

### 3-5. 라이브러리 섹션 로직
- 필터: 클라이언트 필터링(URL 무변화), 카테고리 매핑 {Templates:"template", 3D Scenes:"3d_scene", Backgrounds:"background"}
- 정렬: Popular=likes desc→createdAt desc / Recent=createdAt desc
- 배너 삽입: FNV-1a 시드+mulberry32 — 첫 위치 1+⌊2r⌋, 간격 5+⌊3r⌋, 동일 타입 최소 30칸 (goUnlimited/hireUs/subscribe 3종 8장)
- 카드 비디오: preload none, src는 IO 진입(threshold .1) 후 주입, 150+rand(140)ms 스태거 재생, 이탈 pause
- SSR 전략 재현: 첫 8장 풀 마크업 + 나머지 skeleton(glass-card pulse) → 하이드레이션 교체, IO rootMargin 1200px
- NEW 뱃지: createdAt 7일 이내
- 모달 딥링크: ?layer={slug}, popstate 대응, 최근 본 10개 gl-recently-viewed(localStorage)
- 스크롤 잠금: 모달 열림 → html overflow hidden (원본은 lenis.stop 병행이나 휴면이므로 CSS 잠금만으로 동일)

### 3-6. 디자인 토큰 (전문은 원본 CSS에서 이식)
- 다크 단일: bg #060507, surface #0c0b10/#131218, text #f5f4f7/#a3a1ad/#6a6873
- 액센트: 실버 그라데 (#e8eaef→#bcc0ca), 프리미엄 그라데(#bcc0ca→#feeae1→#c0cef2), 웜 #ffa582/#ff7a4e, heart #ff4d6d
- glass: tint #ffffff0b, blur 18px(5곳 한정) / radius: card 12·panel 9·control 8·pill 999·stage 24
- 폰트: 본문 Onest(400/500/600)·디스플레이 GeneralSans(300쓰임·400~700) — hero-title clamp(1.6rem,4.8vw,3.5rem) w300 ls-.036em
- AdaptiveGrid: >1920px에서 html font-size 스케일업(base 1920, coef .6666)

## 4. 작업 순서 (빌드 단계 — 다음 세션)

| # | 단계 | 내용 | 검증 |
|---|---|---|---|
| 1 | 스캐폴드 | create-next-app(TS·Tailwind v4·App Router) + 의존성 5종 + 폰트 로컬 등록 + 토큰 CSS 이식 | dev 부팅 |
| 2 | 모션 프리미티브 | §3-1 7종 + springsConfig + 스토어(zustand) — **컴포넌트 스펙 먼저 작성** (`docs/research/components/*.spec.md`, 이 문서 §3이 근거) | 단위 데모 |
| 3 | 셸 | Header·PromoBanner·NavigationProgress·Loader·MeshBackdrop·Footer·Cookie·Toaster | 원본 대비 |
| 4 | 히어로 | HomeHero 텍스트 스태거 + BorderGlow CTA + HeroScene(three) 이식 | 1440px 비교·60fps |
| 5 | 라이브러리 | ProjectsGrid(필터·정렬·배너 PRNG·skeleton) + ProjectCard(비디오·--lift·글로우·HUD) | #projects 완전 비교 |
| 6 | 모달 | 상세 모달 전체(딥링크·쿼터 mock·아코디언·ClickToPlayVideo) | 딥링크·ESC·스크롤잠금 |
| 7 | 검증 | 1440/768/390 나란히 스크린샷 + 인터랙션 재생 + `tsc --noEmit` + `next build` | 완료 게이트 |

- 병렬화: 2~3단계에서 프리미티브별 병렬 빌더 디스패치 가능(스펙 인라인 계약). 4·5·6은 프리미티브 완성 후.
- 완료 후 `clones/_완료/getlayers/`로 이동, 재사용 효과(BorderGlow·BlurWords·ProgressTrigger·HeroScene 은하·카드 비디오 그리드 등)는 요청 시 `effects/`로 승격.

## 5. 한계·리스크 (BLOCKED.md와 연동)

1. **서버 기능은 mock** — 좋아요 집계·인증·결제·프롬프트 원문(유료 콘텐츠)은 원본 서버 소유. UI/UX만 동일 재현.
2. 매니페스트 추출 2회 행업 → 생략. 검증은 스크린샷 비교로 대체(7단계).
3. About/Pricing/Contact 등 서브페이지는 이번 범위 밖(홈+#projects+모달 우선). 필요 시 2차.
4. 프로모 카운트다운 종료 시각·GA·Vercel 피드백 등 운영 요소는 재현 대상 아님.
