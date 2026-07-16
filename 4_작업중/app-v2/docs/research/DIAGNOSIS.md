# DIAGNOSIS — https://www.getlayers.ai/

> 생성: 2026-07-02T11:06:03.026Z · clonecraft/diagnose.mjs

## 결정: **경로 1 — 원본 직접 이식** (`port-original`)

- 근거: 분석 JS 14개 중 13개가 가독(평균점수 6.9/10). 의미있는 식별자 다수 → 경로1. (정적 SSR이기도 함 — 픽셀동일이 목표면 경로 1.5 미러도 선택지.)
- 소스맵: 없음
- 가독성: 분석 JS 14개 중 가독 13개 · 평균점수 6.9/10
- 정적 SSR: **예** (콘텐츠가 raw HTML에 존재) · 신호(img 0·h 20·p 21·본문 2885자)

## 3D / WebGL

- 3D 신호: **감지됨**
- → 감지 시 B-4(에셋 복사 + Three.js 재구성) 적용. 커스텀 GLSL은 근사 + BLOCKED.md 기록.

## 탐지된 라이브러리/프레임워크

`Lenis (smooth scroll)`, `Framer Motion`, `Three.js`, `React Three Fiber`, `React`, `Next.js`

## 스크립트 인벤토리

- 외부 `<script src>`: 17개 · 인라인: 15개 · 분석: 14개

| JS | bytes | 가독 | 점수 | 소스맵 |
|---|---|---|---|---|
| 07uz2g0_38qia.js | 43946 | ✅ | 8 | — |
| 0-.u2vp1.7_jx.js | 231603 | ✅ | 6 | — |
| 0a2o_5edih7an.js | 149841 | ✅ | 6 | — |
| turbopack-0jlp1b.jbnmhn.js | 10947 | ❌ | 5 | — |
| 01xlw8hd842-c.js | 3377 | ✅ | 7 | — |
| 0io2a~bqy4q1c.js | 54644 | ✅ | 8 | — |
| 0ru9lekhq5wzu.js | 20386 | ✅ | 8 | — |
| 0y757sv-g.fer.js | 28743 | ✅ | 6 | — |
| 0gqnb4z11xdb6.js | 29574 | ✅ | 8 | — |
| 08bhthti0s7i3.js | 47078 | ✅ | 6 | — |
| 15_uoi6tr.p54.js | 1764 | ✅ | 8 | — |
| 0i-mbh5zpa~n2.js | 2874 | ✅ | 8 | — |
| 0eyuznej1vvzm.js | 1518 | ✅ | 6 | — |
| 13m583hpf-38s.js | 37408 | ✅ | 6 | — |

## 다음 단계

1. 소스맵이 있으면 원본 TSX/JSX/Vue 트리 복원 → 모듈 경계 1:1 정리(B-1).
2. 외부 라이브러리 동일 버전 설치.
3. `extract-manifest.mjs`로 매니페스트도 떠 레이아웃/스타일 교차검증.
4. `download-assets.mjs`로 에셋 전부 로컬화(3D 포함, B-3).
