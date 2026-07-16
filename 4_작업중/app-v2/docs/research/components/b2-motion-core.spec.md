# B2 — 모션 코어 스펙 (components/motion/ 4파일)

## 산출 파일
`components/motion/Spring.tsx` · `Hover.tsx` · `ProgressTrigger.tsx` · `BlurWords.tsx`(BlurBlock 포함)

## API — docs/CONTRACTS.md "B2" 절의 시그니처 그대로 (변경 금지)

## 원본 참조 (이식 원천 — 로직·수치 이대로)
- `docs/research/beautified/0ru9lekhq5wzu.js` — Spring 컴포넌트·springsConfig
- `docs/research/beautified/0y757sv-g.fer.js` — Hover
- `docs/research/beautified/13m583hpf-38s.js` — ProgressTrigger·BlurWords·BlurBlock

## 동작 규정 (원본 실측)
### Spring
- mode "once": IntersectionObserver 진입 1회 → from→to. "always": 진입/이탈 왕복. "forward": 스크롤 리스너로 요소 top>0 여부 추적(위로 지나가면 to 유지).
- delayIn/delayOut(ms), enabled=false면 to 고정 즉시, immediateOut=true면 out은 immediate.
- disableOnMobile: springsConfig.disableOnMobile.spring 기본 false — prop 지정 시 ≤768px에서 애니메이션 없이 to 고정.
- y/x는 px translate3d, scale 합성, blur는 filter blur(px). CSS 변수 키("--lift" 등)도 통과.
- useIsStaticMode() true면 무조건 to 고정(정적).
### Hover
- mouseenter→to, mouseleave→from. 기본 disableOnMobile=true(≤768 무효). trigger ref 주면 그 요소에 리스너, 아니면 자기 자신.
### useProgressTrigger
- start/end "top bottom" 문법: 첫 단어=요소 기준점, 둘째=뷰포트 기준점. progress = (뷰포트기준 - 요소기준시작) / (끝 - 시작) clamp 0..1.
- rAF 루프 + frameInterval(기본 10프레임마다 실측) + IntersectionObserver로 화면 밖이면 10프레임 후 루프 중단, 재진입 시 재개.
- useSpring으로 interpolatedProgress 보간(기본 config), onChange({progress, interpolatedProgress}) 콜백. 반환은 SpringValue.
### BlurWords
- text를 공백 단위 분해, 각 단어 inline-block span. 단어 i 시작점 = i/(n-1) * min(.25, unrevealAt-rampWidth), 폭 rampWidth.
- t = clamp((p - start)/rampWidth), opacity=t, filter blur((1-t)*blur px), translateY((1-t)*yOffset px).
- exit=true면 p>unrevealAt부터 역방향으로 사라짐(1-(p-unrevealAt)/(1-unrevealAt) 램프).
- 기본값 blur14 yOffset12 rampWidth.18 unrevealAt.7. BlurBlock은 블록 1개 버전(16/14/.22).

## 품질
- react-spring v10 API(useSpring/useSpringValue/animated). SSR 안전(window 접근은 effect 안).
- 각 파일 상단에 원본 청크 유래 주석 1줄.
