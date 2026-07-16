// 위키 v2 신규 — 카드/모달 미디어 자리를 채우는 공용 컴포넌트.
// 원본 PosterVideo(영상)를 대신해 위키 항목의 detail.svg(인라인 SVG)·demo(인라인 HTML)·
// 외부 이미지 URL(artworks/gallery/figurePortraits) 세 가지 미디어 종류를 하나의 자리에서 분기 렌더한다.
//
// variant="fill"(기본) — 모달 히어로(.modal-hero, 고정 종횡비 프레임)용. absolute+inset-0로 채움(디자인 불변).
// variant="natural"    — 탐색 그리드 "교과서 도판" 프로토타입(2026-07-16)용. crop·레터박스 없이
//   원래 판형 그대로(SVG 2.33:1·그림은 원비율) 컬럼 폭 100%로 자연스러운 높이로 흐른다.
import type { Project } from "@/lib/types";

interface WikiMediaProps {
  project: Project;
  className?: string;
  variant?: "fill" | "natural";
}

/** detail.svg 도판의 첫 <rect fill="..."> 배경색을 추출 — svg 자체가 이미 이 색으로 꽉 차 있으므로
 *  (viewBox 전체를 덮는 배경 rect) 감싸는 div에도 같은 색을 얹어 어떤 경우에도 이질감이 없게 한다. */
function extractSvgBackground(svg: string): string | undefined {
  const m = svg.match(/<rect[^>]*\sfill=["']([^"']+)["']/i);
  return m?.[1];
}

export default function WikiMedia({ project, className = "", variant = "fill" }: WikiMediaProps) {
  const { image, imageKind, title } = project;
  const natural = variant === "natural";
  const baseClass = natural ? "wiki-media-natural" : "wiki-media";

  // natural(그리드) 전용 행 높이 균질화: SVG 도판은 전부 560x240(2.33:1)이라 원비율 그대로 이미 균질하지만,
  // img(사진·그림)·html(타이포 데모)은 판형이 제각각이라 같은 행에서 캡션 라인이 들쭉날쭉해진다.
  // → 이 둘만 3:2 고정 프레임+crop을 얹는다(모달의 variant="fill"에는 영향 없음 — 원비율 유지, 열람용).
  const cropClass = natural && imageKind !== "svg" ? ` ${baseClass}-crop` : "";

  if (imageKind === "img") {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={image} alt={title} className={`${baseClass}${cropClass} ${className}`} loading="lazy" />;
  }

  const bg = imageKind === "svg" ? extractSvgBackground(image) : undefined;

  // svg·html은 어댑터 스크립트(scripts/build-wiki-data.mjs)가 site/data 원본 JSON에서 그대로 pass-through한
  // 신뢰 가능한 로컬 콘텐츠 문자열 — 사용자 입력이 아니므로 dangerouslySetInnerHTML이 안전하다.
  return (
    <div
      className={`${baseClass} ${imageKind === "svg" ? `${baseClass}-svg` : ""}${cropClass} ${className}`}
      style={bg ? { background: bg } : undefined}
      role="img"
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: image }}
    />
  );
}
