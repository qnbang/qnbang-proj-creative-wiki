# B4 — HeroScene(three r158 파티클 은하) 이식 스펙

## 산출 파일
`components/hero/HeroScene.tsx` (필요시 `components/hero/galaxy.ts` 분리 허용 — 이 2개만)

## API
`export default function HeroScene({ active, className }: { active: boolean; className?: string })`
- 캔버스가 부모를 absolute로 채움(원본 .hero-scene 관례, 클래스 hero-scene 부여).
- three는 `import * as THREE from "three"` (r158 고정 설치됨). R3F 금지 — 바닐라 useEffect 패턴.

## 원본 참조 (이식 원천)
- `docs/research/beautified/153s5cp_0jwcv.js` — **11089~11441행이 앱 씬 코드**(그 앞은 three 코어 번들 — 이식 금지, npm three 사용)

## 씬 규정 (원본 실측 — 수치 변경 금지)
- Renderer: alpha+antialias, `setPixelRatio(min(devicePixelRatio,1))`, setSize=부모 rect.
- Camera: PerspectiveCamera(50, aspect, .1, 50), pos(0,0,15).
- Lights: Ambient(0xffffff,1) + Directional ×3 pos [0,0,10],[-2,0,0],[2,0,0].
- Points ×2 (두 번째 rotation.y=π), Group rot(1,-1.2,.5), scale .8.
- 파티클 수: ≤576px→5000(size .1~4) / ≤1440→5000(.5~8) / 그외 10000(.5~8). universeInitialRadius 2.5.
- 초기 분포: 구면 균일 × 반경 pow(.4*rand,1), 30% 확률 rand*=4(외곽 희소). attributes: position/size/used/color.
- 색(오버브라이트, 셰이더에서 /255): {322,324,334} 주 / {202,204,214} / {118,120,130} — 계단식 가중(1/t) 랜덤.
- 은하 형성(매 프레임 CPU): E+=.02; 프레임당 ≤20개 미사용 포인트를 x=cos(E)*d*.8, z=sin(E)*d에 활성화; 활성 포인트 반경 +v(초기 .012, −2e-5/frame, 최소 .002); used 알파 +.01→1 후 −.003 감쇠.
- Material: `MeshPhysicalMaterial(roughness .4, metalness .4, transparent, depthTest:false, toneMapped:false)` + **onBeforeCompile 주입** — beautified 소스의 GLSL 그대로:
  - vertex: uniforms iTime/universeIn/uCursor/uAspect + attributes size/used/color → gl_PointSize=size; 커서 밀어내기(NDC, 반경 .08, push=pow(1-d/r,2)*.14).
  - fragment: gl_PointCoord 원형 discard + 페이크 블룸(core smoothstep .32 / halo² *.55) + used·in/out 알파.
- uniforms: iTime(Clock)/universeIn(1)/universeOut(.4+.6*scrollProgress)/uCursor(lerp .12, leave 시 {10,10})/uAspect.
- 스크롤: 자체 rAF에서 `.hero-region` rect → progress=clamp(-top/height,0,1) lerp .1 → camera.z=15-5p, universeOut 갱신.
- active=false: rAF 유지하되 렌더/연산 스킵. 언마운트: 리스너·geometry·material·renderer dispose.
- 리사이즈 대응(부모 ResizeObserver 또는 window resize).

## 품질
- "use client". SSR 안전. tsc strict 통과. 파일 상단 유래 주석.
