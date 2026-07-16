# BLOCKED — 재현 불가/생략 항목 기록

> clonecraft Contract #7 (정직). 2026-07-02.

## 재현하지 않는 것 (원본 서버 소유)
- **프롬프트 원문·소스코드 다운로드**(유료 콘텐츠), 인증(Supabase), 결제, 좋아요 서버 집계, 이메일 구독 발송 — 전부 UI만 재현하고 데이터는 localStorage/정적 JSON mock.
- GA(G-7CBVZGD161)·Vercel 피드백 스크립트·OG 동적 이미지 — 재현 대상 아님.

## 기술적 공백/판단
- **extract-manifest.mjs 2회 행업**(기본·--no-hover 모두 "loading" 단계에서 무진행, 각 15분+) → 매니페스트 없이 진행. 교차검증은 원본 CSS/HTML 직독 + 완료 단계 스크린샷 비교로 대체. (스킬 이슈로 별도 기록: ISS 참조)
- **Lenis**: 원본 번들에 본체 없음 + 모션 모드 실측(휠 입력 즉시 점프, lenis 클래스/전역 부재) → **휴면 코드**로 판정, 클론에 미도입. `useScroll` 스토어 구조는 유지하되 네이티브 스크롤 + `scrollIntoView({behavior:"smooth"})`.
- MeshGradient는 @paper-design/shaders-react 패키지 도입으로 재현(원본이 무수정 번들) — 자체 GLSL 이식 불필요.
- 쿠키 배너의 원본 특이점: acceptAll도 `{analytics:false,marketing:false}` 저장(사실상 reject와 동일) — 동일하게 재현할지는 빌드 시 결정(기본: 동일 재현).

## 데이터 스냅샷 (2026-07-02 기준)
- 프로젝트 87건·좋아요 수는 **2026-07-02 SSR HTML 스냅샷**. 원본 라이브 사이트는 좋아요·신규 템플릿이 실시간 변동 → Popular 정렬 순서와 배너 삽입 위치(시드=정렬된 id 목록)가 시점에 따라 라이브와 다를 수 있다. 정렬·배너 알고리즘 자체는 원본 코드 라인 단위 이식(같은 데이터면 동일 결과).
- 프로모 배너 카운트다운은 서버 앵커 대신 "자정까지" mock.

## 에셋
- mp4 226개(1.3GB)는 로컬 보관하되 깃 제외(`clones/**/public/**/*.mp4`). 원본 URL↔로컬 매핑: `docs/research/asset-map.json`.
- 폰트 GeneralSans는 원본 서빙 woff2 그대로(라이선스: Fontshare 무료 폰트, 학습용 로컬 보관).
