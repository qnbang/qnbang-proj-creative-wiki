// 위키 v2 — 원본 tier-badge(Free/Premium) 자리·스타일을 재사용해 정설성(credibility)을 표시.
// 신호등(초록/노랑/주황 등 색 코딩) 금지 — 무채색 glass pill에 텍스트 라벨만 둔다(이모지·색점 없음).
import { CREDIBILITY_META } from "@/lib/wiki-meta";
import type { CredibilityKey } from "@/lib/types";

export default function CredibilityBadge({
  credibility,
  className = "",
}: {
  credibility: CredibilityKey;
  className?: string;
}) {
  const meta = CREDIBILITY_META[credibility];
  return (
    <span className={`tier-badge tier-badge-static ${className}`} tabIndex={0}>
      {meta.label}
      <span className="badge-tooltip" role="tooltip">
        {meta.tip}
      </span>
    </span>
  );
}
