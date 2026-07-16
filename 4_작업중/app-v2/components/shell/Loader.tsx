"use client";

import { useEffect, useState } from "react";
import { animated, useTransition } from "@react-spring/web";
import { useIsStaticMode } from "@/components/motion/RenderModeProvider";
import { SPRING } from "@/lib/springs";
import { useLoaderState } from "@/stores/loader";

// 유래: docs/research/beautified/0gqnb4z11xdb6.js Loader 모듈
// sessionStorage "gl-loaded" 존재(재방문) → 즉시 markComplete + 페이드아웃 스킵.
// 로고 scale 1.4는 CSS(.loader-center) 담당 — 마크업은 원본과 동일하게 유지.

// 위키 v2: Header/Footer와 동일한 이중 원+중심점 마크로 교체(원본 "getlayers" 워드마크·
// 3겹 마름모 그라디언트는 브랜드 잔재라 로더 스플래시에서도 제거).
function Logo() {
  return (
    <span className="logo ">
      <svg className="logo-mark" viewBox="0 0 28 28" fill="none" aria-hidden="true" focusable="false">
        <circle cx="14" cy="14" r="10" stroke="var(--text-primary)" strokeWidth="2.2" />
        <circle cx="14" cy="14" r="3.2" fill="var(--accent-warm-1)" />
      </svg>
      <span className="logo-word">
        <span className="logo-word-dim">크리에이티브</span>인덱스
      </span>
    </span>
  );
}

export default function Loader() {
  const isStatic = useIsStaticMode();
  const [visible, setVisible] = useState(!isStatic);
  const markComplete = useLoaderState((s) => s.markComplete);

  useEffect(() => {
    if (isStatic) return;
    if (sessionStorage.getItem("gl-loaded")) {
      setVisible(false);
      return;
    }
    const t = window.setTimeout(() => {
      sessionStorage.setItem("gl-loaded", "1");
      setVisible(false);
    }, 1600);
    return () => window.clearTimeout(t);
  }, [isStatic]);

  // visible이 꺼지는 순간 markComplete — 페이드아웃 완료를 기다리지 않음 (원본 동일)
  useEffect(() => {
    if (isStatic || !visible) markComplete();
  }, [isStatic, visible, markComplete]);

  const transitions = useTransition(visible, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: SPRING.loaderLeave, // {220, 30}
  });

  if (isStatic) return null;

  return transitions((style, item) =>
    item ? (
      <animated.div className="loader" style={{ opacity: style.opacity }}>
        <div className="loader-border" aria-hidden="true" />
        <div className="loader-center">
          <Logo />
        </div>
      </animated.div>
    ) : null
  );
}
