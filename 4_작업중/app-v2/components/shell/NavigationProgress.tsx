"use client";

import { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";

// 유래: docs/research/beautified/0gqnb4z11xdb6.js 모듈 75331 (NavigationProgress)
// 원본은 usePathname 변화로 완료를 감지하지만 클론은 단일 페이지(서브페이지 스텁)라
// 시작 600ms 후 100% → 320ms 후 리셋으로 mock (스펙 지시).

export default function NavigationProgress() {
  const [active, setActive] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      const anchor = (e.target as HTMLElement | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!anchor || (anchor.target && anchor.target !== "_self")) return;
      const href = anchor.getAttribute("href") ?? "";
      // 해시 앵커·mailto·tel 제외 — 경로가 바뀌는 내부 링크만 감지 (원본 필터)
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      setFinishing(false);
      setActive(true);
      timers.current.forEach((t) => window.clearTimeout(t));
      const t1 = window.setTimeout(() => setFinishing(true), 600);
      const t2 = window.setTimeout(() => {
        setActive(false);
        setFinishing(false);
      }, 600 + 320);
      timers.current = [t1, t2];
    };
    document.addEventListener("click", onClick, true); // 캡처 단계 (원본 동일)
    return () => {
      document.removeEventListener("click", onClick, true);
      timers.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  // width: 0 → 88%(duration 1100) → 100%({320,26}) → 리셋({220,24})
  const fill = useSpring({
    width: active ? (finishing ? 100 : 88) : 0,
    config: active
      ? finishing
        ? { tension: 320, friction: 26 }
        : { duration: 1100 }
      : { tension: 220, friction: 24 },
  });
  const fade = useSpring({
    opacity: active && !finishing ? 1 : 0,
    config: { tension: 220, friction: 24 },
  });

  return (
    <animated.div className="nav-progress" style={{ opacity: fade.opacity }} aria-hidden="true">
      <animated.div className="nav-progress-fill" style={{ width: fill.width.to((w) => `${w}%`) }} />
    </animated.div>
  );
}
