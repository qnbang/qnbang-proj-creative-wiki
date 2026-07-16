"use client";

import { useEffect, type ReactNode } from "react";
import { useScrollStore } from "@/stores/scroll";

// 유래: docs/research/beautified/0gqnb4z11xdb6.js 모듈 59498 (ScrollLayout + ScrollManager)
// 원본의 Lenis 인스턴스는 항상 null(휴면)이라 미도입 확정 — 네이티브 스크롤 + scrollIntoView로 재현.

/** isEnableScroll=false → html 스크롤 잠금 (원본 c 함수 이식) */
function applyScrollLock(enable: boolean): void {
  const html = document.documentElement;
  if (enable) {
    html.style.removeProperty("position");
    html.style.removeProperty("overflow");
    html.style.removeProperty("height");
  } else {
    html.style.position = "relative";
    html.style.overflow = "hidden";
    html.style.height = "100%";
  }
}

/** 예외적으로 children prop을 받는 유일한 셸 컴포넌트 (계약 명시) */
export default function ScrollLayout({ children }: { children: ReactNode }) {
  const isEnableScroll = useScrollStore((s) => s.isEnableScroll);

  // 마운트 시 최상단 복귀 (원본 ScrollManager 첫 이펙트)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applyScrollLock(isEnableScroll);
  }, [isEnableScroll]);

  // 동일 경로 #hash 앵커 클릭 인터셉트 → 부드러운 스크롤 (원본 클릭 리스너, Lenis 분기 제거)
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;
      if (!(anchor.getAttribute("href") ?? "").includes("#")) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const target = document.getElementById(url.hash.slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="scroll-layout">
      <div className="scroll-layout-content">{children}</div>
    </div>
  );
}
