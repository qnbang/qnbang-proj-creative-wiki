// 위키 v2 — getlayers Project 스키마를 그대로 유지하되(카드/모달 시각 구조 재사용),
// 콘텐츠 필드를 위키 5개 도메인 데이터로 교체하기 위해 확장했다.
// 원본 필드(id/title/tags/stack/description/image/posterVideo*/controller/likes/createdAt)는 이름 그대로 유지.

export type DomainKey = "aesthetics" | "art-movement" | "typography" | "creative-strategy" | "frontend";

/** 원본 ProjectCategory 자리 — 도메인 5개로 교체 */
export type ProjectCategory = DomainKey;

/** 원본 tier(Free/Premium) 자리 — 정설성(credibility) 5단계로 교체 */
export type CredibilityKey = "established" | "consensus" | "disputed" | "industry" | "personal";

export interface ProjectController {
  videoUrl: string;
  title: string;
  pill: string;
  subtitle: string;
}

export interface WikiPaletteColor {
  hex: string;
  name: string;
}

export interface WikiFont {
  name: string;
  css: string;
  note?: string;
}

export interface WikiSource {
  label: string;
  url: string;
}

export interface WikiArtwork {
  title: string;
  titleEn?: string;
  artist?: string;
  year?: string;
  src: string;
}

export interface WikiRelated {
  id: string;
  title: string;
  domain: DomainKey;
}

/** 도메인별로 있는 필드만 채워짐(원본 JSON detail 구조를 그대로 pass-through) */
export interface WikiDetail {
  desc?: string;
  why?: string;
  rationale?: string;
  how?: string;
  apply?: string[];
  palette?: WikiPaletteColor[];
  fonts?: WikiFont[];
  artworks?: WikiArtwork[];
  galleryImages?: string[];
  sources?: WikiSource[];
}

export interface Project {
  id: string;
  title: string;
  titleEn?: string;
  category: ProjectCategory;
  categoryLabel: string;
  origin?: string;
  year?: number;
  period?: string;
  field?: string;
  tags: string[];
  stack: string[];
  credibility: CredibilityKey;
  description: string;
  /** svg/html 인라인 문자열이거나 이미지 URL — imageKind로 분기 */
  image: string;
  imageKind: "svg" | "html" | "img";
  posterVideo: string;
  posterVideoPreview: string;
  controller?: ProjectController;
  likes: number;
  createdAt: string;
  keywords: string[];
  related: WikiRelated[];
  detail: WikiDetail;
}

export type SortMode = "Popular" | "Recent";

/** 필터 탭 키 — "all" | 도메인 | "bookmarked"(내 보드) */
export type FilterKey = "all" | DomainKey | "bookmarked";
