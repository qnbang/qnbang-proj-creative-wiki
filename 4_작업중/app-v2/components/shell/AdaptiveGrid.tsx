"use client";

import { useEffect } from "react";
import { debounce } from "@/lib/utils";

// 유래: docs/research/beautified/0gqnb4z11xdb6.js 모듈 11062 (AdaptiveGrid)
// 원본은 props { baseWidth: 1920, coef: .6666 } — 계약(프롭 없음)에 맞춰 상수 고정.
// resize 디바운스 150ms는 스펙 추가분 (원본은 즉시 반응).

const BASE_WIDTH = 1920;
const COEF = 0.6666;

/** innerWidth > 1920 → html font-size = 16*(1+((w-1920)/1920)*.6666)px, 그 외 제거 */
function apply(): void {
  const html = document.documentElement;
  if (!html) return;
  // 원본 수식 그대로: 16 - (base - w)/base * 100 * coef * 16/100
  const size = 16 - ((BASE_WIDTH - window.innerWidth) / BASE_WIDTH) * 100 * COEF * (16 / 100);
  if (size > 16) html.style.setProperty("font-size", `${size}px`);
  else html.style.removeProperty("font-size");
}

export default function AdaptiveGrid() {
  useEffect(() => {
    apply(); // 마운트 시 1회 즉시 적용
    const onResize = debounce(apply, 150);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return null;
}
