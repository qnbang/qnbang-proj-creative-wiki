# 크리에이티브 인덱스 — getlayers 리스타일 스펙 (2026-07-15 확정 · 07-16 방향 전환)

> **2026-07-16 최종 방향(사용자 확정)**: 완성본 = `4_작업중/app-v2`(getlayers 클론 포크). 디자인 = getlayers와 동일 유지, UX = 위키(탐색·상세·북마크·구분감), 포인트 = #4545da **계열**(단일 hex 아님), 신호등 색 금지, 리퀴드 글래스 = shuding/liquid-glass(사용자 지정). 바닐라 site/는 보존(참고용).
>
> **타이포·위계는 MMCA 실측 번역 스펙 적용**: 크기 4단 제한(L1 48/300, L2 24, L3 18/600, L4 15px 단일 — 굵기·명도로만 구분), 행간 두 리듬(1.3/1.8), 섹션 헤더→콘텐츠 40px 고정, 준풀블리드+읽기 컬럼 65~70%, 화면당 지배 요소 1개, 썸네일 비율 완전 통일. 실측 원본: `_scratch/2026-07-16/mmca-study/`.

사용자 결정: **다크 전용 전환 + 전면 적용 + 포인트 #4545da**. 이 문서가 값의 정본이다(에이전트 임의 변경 금지, 이탈 시 Deviations 보고).

## 1. 팔레트 (getlayers 실측 → 우리 토큰으로)

| 우리 토큰 | 값 | 원본 근거 |
|---|---|---|
| --bg | #060507 | getlayers --background |
| --surface-1 | #0c0b10 | 카드/모달 바닥 |
| --surface-2 | #131218 | 썸네일 밖 미디어 바닥 |
| --ink | #f5f4f7 | text-primary |
| --ink-soft | #a3a1ad | text-secondary |
| --ink-faint | #6a6873 | text-muted |
| --hairline | #ffffff14 | border-soft |
| --glass-tint / -strong | #ffffff0b / #ffffff12 | 유리 표면 |
| --accent | **#4545da** | 코랄 #ffa582 대체. CTA·active 마커·별 on·글로우·focus |
| --accent-glow | #4545da73 | warm-glow 공식 이식 |
| --accent-cool-glow | #5e80f066 | 유지(히어로 radial용) |
| --media-bg | #f2f4f7 **유지** | SVG 도판 패널은 다크에서도 밝게(판독 보존, 기존 규칙) |

- `[data-theme]` 듀얼 체계 **제거**: 라이트 팔레트·테마 토글 버튼·applyTheme 로직 삭제, 단일 다크.
- 도메인 5색(dot 전용)은 다크 배경 대비가 죽지 않게 명도만 +10~15% 보정(색상 유지). 실측으로 dot이 또렷한지 확인.

## 2. 타이포

- 디스플레이(제목·카드 타이틀·버튼): `"General Sans", "Pretendard Variable", Pretendard, sans-serif` (Fontshare CDN). 히어로 weight 300 + letter-spacing -0.03em(한글엔 -0.02em 상한), line-height 1.1.
- 본문: `Onest, "Pretendard Variable", Pretendard, sans-serif` (Google Fonts). 기존 Adobe kit(late-serif 등) 링크 제거.
- UI 라벨(도메인 en·칩): 600, uppercase, letter-spacing .08em, 0.72~0.78rem.
- 카운트·연도 숫자: `font-variant-numeric: tabular-nums`.
- 한글 조판 기존 규칙 유지: keep-all, 본문 17px·행간 1.7, `--measure` 측정폭 체계 **절대 보존**.

## 3. 형태 언어 (v2 정정 2026-07-16 — 사용자 반려로 카드 해부 재정의)

**v1의 오류: "박스형 카드" 명시가 원본과 다름. getlayers 카드에는 배경 상자·보더가 없다.**

- **카드 해부 (getlayers 원본 스샷 기준)**:
  - 항목 = ① 썸네일 미디어(카드 그 자체, radius 12px, aspect 960/684, hover 글로우·리프트의 대상) ② 그 아래 캡션 행: 제목(1.16rem/600) + 신뢰도 뱃지(Premium 뱃지 문법: pill, 작은 아이콘+텍스트, glass-tint 바닥) ③ 그 아래 태그 필 행: 도메인·카테고리를 pill 태그로(0.875rem, glass-tint+hairline).
  - **배경 상자 없음**: 항목 배경 = 페이지 배경(#060507) 그대로, 보더 없음. 텍스트가 페이지 위에 직접 놓인다.
  - oneLiner·제창자 연도는 카드에서 제거하거나 캡션 아래 1줄 --ink-faint로 최소화(원본은 제목+뱃지+태그만).
- **그리드 밀도**: 1→sm:2→lg:3→xl:4 컬럼. 거터 좁게(가로 ~20px), 항목 간 세로 ~48px. 미디어가 화면을 지배해야 한다.
- **네비 (3분할 캡슐)**: 로고(좌, 캡슐 밖 텍스트) | **중앙 캡슐 알약**(탐색 링크들이 캡슐 안: 탐색·내 보드·소개, active는 흰 12% pill) | 우측(비워도 됨). 캡슐만 유리(blur), 헤더 바탕은 투명+상단 마스크 그라데이션 blur.
- **hover (썸네일 대상)**: `--lift` 0→1, 180ms — 썸네일 밝기 +4%·우상향 화살표(↗) 캡션 행 제목 옆 펼침·#4545da border-glow(커서 추적 radial, mask-composite: exclude, 썸네일 테두리 1.5px 발광). **hover 상태 스크린샷 필수.**
- Radius: 히어로 스테이지·모달 24px / 썸네일 12px / 드롭다운 9px / 컨트롤 8px / 버튼·칩·필·네비·태그 999px.
- 그림자 2층 공식: `inset 0 1px #ffffff14` + `0 14px 34px -16px #000000d9` (모달·드롭다운·캡슐용 — 카드엔 상자가 없으니 미적용).
- 칩/필: --glass-tint + hairline, pill. active 필터칩은 --accent 언더라인/좌측 2px 마커.
- 히어로: 스테이지 24px 라운드 카드 + radial 2겹(#4545da 쿨 글로우) — v1 그대로 유지.

## 4. 네비 — 리퀴드 글래스 (SVG displacement)

- 구현체: deepika-builds/liquid-glass (MIT, 단일 파일·의존성 0) — **vendoring**: `site/js/liquid-glass.js`로 가져오되 코드 전체를 읽고 감사(외부 fetch·eval·트래킹 없어야 함) 후 출처·라이선스·커밋 해시를 파일 헤더 주석에 남길 것.
- 적용: 플로팅 알약 네비(3분할: 로고 | 중앙 내비 | 우측 링크)에 `liquidGlass(el, { scale: -80, chroma: 6, border: 0.07, mapBlur: 12, fallbackBlur: 16 })` 부근에서 실측 튜닝. 테마 토글 버튼 자리는 제거.
- Safari/Firefox: 라이브러리 내장 `glass.supported=false` → blur+saturate 자동 폴백(lg-fallback) 확인만.
- 성능: 네비 1개에만 적용(카드에 남발 금지). resize 시 glass.refresh().

## 5. 인터랙션

- 카드 hover 스프링감: 빠르고 탄탄(≈180ms, cubic-bezier(0.22, 1, 0.36, 1)). 카드 리빌 IntersectionObserver + 55ms 스태거(1회).
- prefers-reduced-motion: 리빌·글로우·글래스 굴절 비활성(폴백 blur만).
- 모바일(≤768px): hover 효과 비활성, 네비는 알약 유지.

## 6. 보존 (건드리지 말 것)

- `--measure` 측정폭 체계·중앙정렬 (오늘 수정분)
- SVG 썸네일 밝은 패널(--media-bg)·cardThumb 배경색 추출 로직
- 상세 타이틀 라인 우측 .detail-star (형태는 새 토큰으로 리스킨만)
- 데이터(site/data/*.json)·라우터·검색 로직

## 7. QA 게이트

홈·탐색(도메인 필터)·상세(fe-isr·미감·타이포 폰트 미리보기)·내 보드·소개 — 1440/390 스크린샷, 콘솔 에러 0, 가로 오버플로 0, 측정폭 실측(폭 통일·L≈R), dot 5색 판독, Safari 폴백은 코드 경로 확인으로 갈음.
