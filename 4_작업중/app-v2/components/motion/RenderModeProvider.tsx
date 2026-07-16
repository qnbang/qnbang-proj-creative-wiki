"use client";
// 유래: docs/research/beautified/0ru9lekhq5wzu.js 모듈 37203 RenderModeProvider 이식

import { createContext, useContext, useEffect, useState } from "react";
import type { JSX, ReactNode } from "react";
import { Globals } from "@react-spring/web";

type RenderMode = "motion" | "static";

const RenderModeContext = createContext<RenderMode>("motion");

/** static이면 react-spring 전역 애니메이션 스킵 (원본 로직) */
function applySkipAnimation(mode: RenderMode): void {
  Globals.assign({ skipAnimation: mode === "static" });
}

export function RenderModeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [mode, setMode] = useState<RenderMode>("motion");

  useEffect(() => {
    applySkipAnimation(mode);
    document.documentElement.setAttribute("data-render-mode", mode);
  }, [mode]);

  useEffect(() => {
    // 원본: webdriver(봇/자동화)면 즉시 static, 아니면 reduced-motion 감지 + change 리스닝
    if (navigator.webdriver) {
      setMode("static");
      return;
    }
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => {
      if (mql.matches) setMode("static");
    };
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return <RenderModeContext.Provider value={mode}>{children}</RenderModeContext.Provider>;
}

export function useIsStaticMode(): boolean {
  return useContext(RenderModeContext) === "static";
}
