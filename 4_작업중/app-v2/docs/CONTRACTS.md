# 빌더 공유 계약 (파일 소유권·API 시그니처)

> 모든 병렬 빌더는 이 계약대로 파일을 만들고, **다른 빌더 소유 파일은 절대 만들거나 수정하지 않는다.**
> 공통: TypeScript strict · App Router · 인터랙티브 컴포넌트는 `"use client"` · import는 `@/` 경로 · 애니메이션은 `@react-spring/web`만(GSAP/framer 금지).

## 이미 존재(수정 금지, import만)

- `lib/types.ts` — `Project`, `ProjectCategory("template"|"3d_scene"|"background")`, `ProjectTier`, `SortMode("Popular"|"Recent")`, `FilterKey("all"|카테고리)`
- `lib/projects.ts` — `projects: Project[]`(URL 로컬화 완료), `CATEGORY_LABELS`, `filterProjects`, `sortProjects`, `isNew`, `getProject`, `categoryCounts`, `localizeAssetUrl`
- `lib/utils.ts` — `lerp`, `clamp`, `debounce`, `fnv1a`, `mulberry32`
- `lib/springs.ts` — `springsConfig`, `SPRING`(프리셋: heroText/headerFade/cardReveal/cardHover/buttonHover/modal/mobileMenu/dropdown/accordion/toast/loaderLeave/meshFade), `isMobileViewport()`
- `app/globals.css` — `@import "tailwindcss"` + `./fonts.css` + `./components.css` (B1이 뒤 2개 생성)
- 미디어: `/templates/...`, `/3d_scenes/...`, `/backgrounds/...` (public), 폰트: `/fonts/*.woff2`

## B1 — CSS 이식
- `app/fonts.css` — @font-face 전부(URL `/fonts/...`로), `:root`에 `--font-general`·`--font-onest` 정의
- `app/components.css` — `:root` 디자인 토큰 전부 + 원본 커스텀 클래스 전부(.glass·.btn·.border-glow·.project-card·.card-*·.hero-*·.filter-*·.modal-*·.loader*·.header-*·.footer* 등)

## B2 — 모션 코어 (`components/motion/`)
```tsx
// Spring.tsx
export interface SpringStyleTarget { opacity?: number; y?: number; x?: number; scale?: number; blur?: number; [cssVar: `--${string}`]: string | number | undefined }
export default function Spring(props: {
  tag?: React.ElementType;            // 기본 "div"
  from: SpringStyleTarget; to: SpringStyleTarget;
  mode?: "always" | "once" | "forward"; // 기본 "once"
  config?: { tension: number; friction: number };
  delayIn?: number; delayOut?: number; enabled?: boolean;
  disableOnMobile?: boolean; immediateOut?: boolean;
  className?: string; style?: React.CSSProperties; children?: React.ReactNode;
}): JSX.Element
// y/x→translate3d(px), scale→transform 합성, blur→backdropFilter px 아님 filter blur(px)
// mode "once": 뷰포트 진입 1회(IntersectionObserver) / "forward": 요소 top>0 동안만 to / "always": 진입/이탈 왕복

// Hover.tsx
export default function Hover(props: {
  from: Record<string, string | number>; to: Record<string, string | number>; // CSS 변수 포함 ("--lift" 등)
  config?: { tension: number; friction: number };
  disableOnMobile?: boolean;          // 기본 true (≤768px 무효)
  trigger?: React.RefObject<HTMLElement | null>; // 외부 호버 트리거(선택)
  tag?: React.ElementType; className?: string; style?: React.CSSProperties; children?: React.ReactNode;
}): JSX.Element

// ProgressTrigger.tsx
export function useProgressTrigger(opts: {
  ref: React.RefObject<HTMLElement | null>;
  start?: string;  // "top bottom" 등 (top|center|bottom)×(top|bottom|center), 기본 "top bottom"
  end?: string;    // 기본 "bottom top"
  frameInterval?: number; // rAF 스로틀(기본 10 → 약 100ms)
  onChange?: (v: { progress: number; interpolatedProgress: number }) => void;
}): SpringValue<number>  // 스프링 보간된 progress(0~1)

// BlurWords.tsx
export function BlurWords(props: {
  text: string; progress: SpringValue<number>;
  blur?: number; yOffset?: number; rampWidth?: number; unrevealAt?: number; exit?: boolean;
  className?: string; tag?: React.ElementType;
}): JSX.Element   // 기본 blur14 yOffset12 rampWidth.18 unrevealAt.7 exit true
export function BlurBlock(props: { children: React.ReactNode; progress: SpringValue<number>; blur?: number; yOffset?: number; rampWidth?: number; className?: string }): JSX.Element // 기본 16/14/.22
```

## B3 — 장식·모드·스토어
```tsx
// components/motion/RenderModeProvider.tsx
export function RenderModeProvider({ children }: { children: React.ReactNode }): JSX.Element
export function useIsStaticMode(): boolean
// components/motion/BorderGlow.tsx
export default function BorderGlow(props: { variant?: "button" | "card-sm" | "card-lg" | "button-lg"; className?: string }): JSX.Element
// components/motion/AnimatedSpark.tsx
export default function AnimatedSpark(props: { className?: string }): JSX.Element
// stores/scroll.ts
export const useScrollStore: UseBoundStore<{ isEnableScroll: boolean; setEnableScroll(v: boolean): void }>
// stores/toast.ts
export const useToast: UseBoundStore<{ toasts: { id: number; message: string }[]; show(message: string): void; dismiss(id: number): void }>
// stores/loader.ts
export const useLoaderState: UseBoundStore<{ complete: boolean; markComplete(): void }>
// stores/likes.ts  (localStorage "gl-likes" mock)
export const useLikes: UseBoundStore<{ liked: Record<string, true>; toggle(id: string): void; hydrate(): void }>
export function likesDisplay(base: number, liked: boolean): number   // base + (liked?1:0)
```

## B4 — HeroScene
```tsx
// components/hero/HeroScene.tsx
export default function HeroScene(props: { active: boolean; className?: string }): JSX.Element
// three r158 바닐라. 캔버스는 부모(.hero-stage) absolute 채움. 마운트/해제 시 dispose 완비.
```

## C1 — 셸 (`components/shell/`)
- `ScrollLayout.tsx` — `{children}` 래퍼 div.scroll-layout>div.scroll-layout-content + isEnableScroll→html overflow 잠금 + 앵커 스무스 스크롤
- `Header.tsx`(+MobileMenu 내장 가능) · `PromoBanner.tsx` · `NavigationProgress.tsx` · `Loader.tsx` · `MeshBackdrop.tsx` · `Footer.tsx`(+`SubscribeForm.tsx`) · `CookieBanner.tsx` · `Toaster.tsx` · `AdaptiveGrid.tsx`
- 전부 default export, props 없음(내부 자립). Loader는 useLoaderState.markComplete 호출.

## C2 — 라이브러리 (`components/library/`)
- `ProjectsGrid.tsx` — 메인. props 없음. 내부: 필터/정렬 상태·배너 삽입·`?layer=` 딥링크·최근 본 항목·ProjectModal 렌더
- `ProjectCard.tsx` — `{ project: Project; index: number; eager: boolean; onOpen(id: string): void }`
- `PosterVideo.tsx` — `{ src: string; poster?: string; label: string; className?: string }`
- 보조: FilterTabs/FilterSidebar/SortDropdown/SceneOverlay/BannerCards/RecentlyViewed (자유 구성, C2 폴더 안)

## C3 — 모달 (`components/modal/`)
- `ProjectModal.tsx` — `{ project: Project | null; onClose(): void }` (null이면 leave 트랜지션)
- 보조: ClickToPlayVideo/Accordion/InstructionsSteps 등 C3 폴더 안. 스크롤 잠금은 useScrollStore 사용.

## 통합(오케스트레이터 소유 — 빌더 수정 금지)
- `app/layout.tsx`, `app/page.tsx`, `components/hero/HomeHero.tsx`
