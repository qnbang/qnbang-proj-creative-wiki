// 위키 v2 — 원본 c3-modal 정적 문안(Instructions/FAQ/Discord/License/quota)은 getlayers 제품 특유의
// 카피 판매·잠금 개념이라 전부 걷어냈다(무관 항목). 남긴 건 "정의 복사" 버튼이 쓰는 텍스트 빌더뿐.
import type { Project } from "@/lib/types";

// InstructionsSteps 컴포넌트(원본 "Instructions on how to use" 5스텝 카드)를 재사용해
// detail.apply(적용 팁) 배열을 스텝 목록으로 렌더할 때 쓰는 타입 — 컴포넌트 시그니처 그대로 유지.
export interface InstructionStep {
  title: string;
  text: string;
}

/** "정의 복사" 버튼 — 항목의 핵심 텍스트를 평문으로 모아 클립보드에 담는다 */
export function buildDefinitionText(p: Project): string {
  const lines = [p.titleEn ? `${p.title} (${p.titleEn})` : p.title, "", p.description];
  if (p.detail.desc && p.detail.desc !== p.description) {
    lines.push("", p.detail.desc);
  }
  if (p.detail.why) lines.push("", `왜: ${p.detail.why}`);
  if (p.detail.rationale) lines.push("", `근거: ${p.detail.rationale}`);
  if (p.detail.how) lines.push("", `How: ${p.detail.how}`);
  if (p.detail.apply?.length) lines.push("", "적용:", ...p.detail.apply.map((a) => `- ${a}`));
  lines.push("", `출처: 크리에이티브 인덱스 — ${p.categoryLabel}`);
  return lines.join("\n");
}
