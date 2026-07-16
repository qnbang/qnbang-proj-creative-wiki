import type { CredibilityKey, DomainKey } from "./types";

/** 도메인 5개 한국어 라벨 — 헤더 캡슐·필터탭·사이드바에서 공용 */
export const DOMAIN_LABELS: Record<DomainKey, string> = {
  aesthetics: "미감",
  "art-movement": "양식",
  typography: "타이포",
  "creative-strategy": "전략",
  frontend: "프론트엔드",
};

export const DOMAIN_ORDER: DomainKey[] = [
  "aesthetics",
  "art-movement",
  "typography",
  "creative-strategy",
  "frontend",
];

/** 홈 도메인 개요 섹션용 한 줄 소개 — 백과사전 목차처럼 "여기 5개 영역이 있다"를 3초에 전달 */
export const DOMAIN_BLURBS: Record<DomainKey, string> = {
  aesthetics: "아름다움이 작동하는 원리 — 게슈탈트 지각부터 구도·색채·신경미학까지.",
  "art-movement": "미술·디자인 양식의 역사와 개념 사전 — 르네상스부터 포스트모던까지.",
  typography: "활자의 역사와 사람 — 양식·거장·파운드리, 그리고 한글 타이포그래피.",
  "creative-strategy": "카피·발상·설득의 법칙 — 이론적 근거와 정설성까지 함께.",
  frontend: "웹·앱 개발 용어 사전 — 비전공자 눈높이로, 화면 뒤에서 무슨 일이 일어나는지.",
};

/** 정설성 뱃지 — 원본 tier-badge(Free/Premium) 자리·스타일 재사용.
 *  신호등(색 코딩) 금지 — 무채색 glass pill에 텍스트 라벨만으로 구분한다(이모지·색점 없음). */
export const CREDIBILITY_META: Record<CredibilityKey, { label: string; tip: string }> = {
  established: { label: "정설", tip: "학계·업계에서 널리 검증되고 합의된 원리" },
  consensus: { label: "통설", tip: "많은 전문가가 동의하지만 절대적 정설은 아닌 견해" },
  disputed: { label: "논쟁", tip: "실증이 엇갈리거나 기원·효과가 논쟁 중인 주장" },
  industry: { label: "업계정전", tip: "학술적 검증보다 업계 실무에서 정전처럼 통용되는 지식" },
  personal: { label: "개인철학", tip: "특정 개인·유파의 관점으로, 보편 합의는 아닌 철학" },
};
