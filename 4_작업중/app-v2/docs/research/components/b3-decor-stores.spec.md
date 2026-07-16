# B3 — 장식 프리미티브·렌더모드·스토어 스펙

## 산출 파일
`components/motion/RenderModeProvider.tsx` · `BorderGlow.tsx` · `AnimatedSpark.tsx`
`stores/scroll.ts` · `toast.ts` · `loader.ts` · `likes.ts`

## API — docs/CONTRACTS.md "B3" 절 시그니처 그대로

## 원본 참조
- `docs/research/beautified/0y757sv-g.fer.js` — BorderGlow·AnimatedSpark·useScroll·useSignInModal·useLoaderState
- `docs/research/beautified/0ru9lekhq5wzu.js` — RenderModeProvider·useToast

## 동작 규정 (원본 실측)
### RenderModeProvider
- 마운트 시 `matchMedia("(prefers-reduced-motion: reduce)")` 또는 `navigator.webdriver` → "static", 아니면 "motion".
- html에 `data-render-mode` 속성 반영 + react-spring `Globals.assign({skipAnimation:true})`(static일 때).
- Context로 노출, `useIsStaticMode()` 훅. reduced-motion 변경 리스닝.
### BorderGlow
- 마크업: `span.border-glow[.border-glow-{variant}]` + `span.border-glow-blob` ×2 (aria-hidden).
- `useSpring t: 0→1 loop, duration 4200ms(linear)`. 블롭2 오프셋 +0.5(mod 1).
- t→좌표: 부모(offsetParent 아닌 **바로 부모 요소**)의 width/height/border-radius 실측(ResizeObserver) → 둥근사각형 둘레(직선 4 + 코너 원호 4) 매개변수화로 (x,y) 계산, `transform: translate(-50%,-50%) translate(Xpx,Ypx)` 직접 세팅(스프링 onChange에서 ref로, 리렌더 없이).
- IntersectionObserver rootMargin 200px — 화면 밖이면 루프 pause.
- 정적 모드면 블롭 고정 배치(애니메이션 없음).
### AnimatedSpark
- 스파클 SVG path 3개(원본 btn-icon-circle 내부 모양 — index_pretty.html의 스파클 path 재사용).
- 각 path scale = .4 + .6*sin(t*π), duration 1500ms loop, delay 380ms*i. transform-origin 중심. IO pause.
### stores
- scroll: `{ isEnableScroll: true, setEnableScroll }` 순수 상태(부수효과는 ScrollLayout이).
- toast: show()가 id 증가 push + **3400ms** 후 자동 dismiss.
- loader: `{ complete:false, markComplete() }`.
- likes: localStorage `"gl-likes"`(id 배열) — hydrate()로 로드, toggle(id) 저장. SSR 안전.
