# C3 — 상세 모달 스펙 (components/modal/ 전부)

## 산출 파일 (components/modal/ 밖 생성 금지)
ProjectModal(메인, `{ project: Project | null; onClose(): void }`) · ClickToPlayVideo · Accordion · 보조 자유

## 원본 참조
- 로직: `docs/research/beautified/098-la-ts0ea1.js`(모달 ec·쿼터·복사/다운로드), `13m583hpf-38s.js`(Accordion·ClickToPlayVideo·QuotaMeters)
- 실측 구조(브라우저 관찰): modal-panel.modal-panel-wide — 상단 대형 미디어(webp 포스터→풀 posterVideo 자동재생) + New 뱃지 + Close / 본문: Premium·Commercial licence 뱃지 → h 제목 → Upgrade to unlock(BorderGlow 필 버튼) → 설명 → 액션(Copy prompt 🔒 · Download source code 🔒 · 좋아요 하트 · 링크복사) → 태그 → "Instructions on how to use" 5스텝 → (3d_scene이면 controller 섹션: instruction 비디오+title+pill+subtitle) → FAQ 아코디언 → 하단 CTA

## 동작 규정 (원본 실측)
- **트랜지션**: useTransition(project) {opacity:0, scale:.94, blur:0} → enter {1, 1, 10} → leave {0, .96, 0}, {tension:280,friction:30}. blur는 backdrop-filter px(백드롭). project=null → leave.
- **백드롭**: modal-backdrop 클릭 시 onClose. Escape 닫기. 열림 동안 useScrollStore.setEnableScroll(false), 닫힘 복원. 패널 내부 스크롤 허용(overflow-y auto).
- **미디어**: 처음 image(webp) 표시, posterVideo(풀버전) 로드되면 교체(muted loop autoplay). 3d_scene/background는 시커 있는 ClickToPlayVideo가 아니라 자동재생 — ClickToPlayVideo는 controller instruction 비디오에 사용(#t=0.001 첫프레임 트릭 + 재생/일시정지 오버레이 {tension:280,friction:30} + --seek range 시커).
- **쿼터 mock**(익명 일일): localStorage gl-anon-last-copy/gl-anon-last-download(날짜). Copy prompt: Free면 "프롬프트는 원본 서비스 콘텐츠 — 클론에는 placeholder" 텍스트 복사+토스트, 하루 1회 제한 재현. Premium이면 잠금 → Upgrade 안내 토스트. Download 동일 패턴.
- **좋아요**: useLikes.toggle + likesDisplay. **링크복사**: `{origin}/?layer={id}` clipboard + 토스트 "Link copied".
- **Accordion**: scrollHeight 실측(ResizeObserver) height 스프링 {tension:230,friction:28}, 화살표 rotate 180°. FAQ 5문(원본: Which AI works best… / Can I use these in commercial projects? / I need help with a prompt — how do I reach you? / How often are new prompts added? / Do you ship the source code, or only the prompt? — 답변은 index_pretty/관찰 기반 요약, 내용 명시).
- **Instructions 5스텝**: 01 Copy the prompt or Source Code / 02 Paste it into your AI (We test against Claude (Opus 4.8) and Antigravity…) / 03~05는 원본 텍스트 index_pretty·관찰 기반. 없는 부분은 자연스러운 근사 문안으로(placeholder 명시 주석).
- **관련 항목**: 하단 "Show all" 버튼 → onClose 후 #projects로 스크롤.

## 품질
- "use client". 접근성: role="dialog" aria-modal, 포커스 트랩 간단 구현(Tab 순환), Close aria-label.
- 클래스는 B1 이식 원본 클래스(.modal-*, .tier-badge, .likes-pill 등) 사용.
