"use client";
// 유래: docs/research/beautified/0y757sv-g.fer.js — 모듈 26377 Hover 이식.

import { animated, useSpring } from "@react-spring/web";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ElementType, JSX, ReactNode, RefObject } from "react";
import { isMobileViewport, springsConfig } from "@/lib/springs";
import { debounce } from "@/lib/utils";

interface HoverProps {
  from: Record<string, string | number>;
  to: Record<string, string | number>;
  config?: { tension: number; friction: number };
  disableOnMobile?: boolean;
  trigger?: RefObject<HTMLElement | null>;
  tag?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function Hover({
  from,
  to,
  config,
  disableOnMobile = true,
  trigger,
  tag = "div",
  className,
  style,
  children,
}: HoverProps): JSX.Element {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 원본 useWindowWidth(debounce 300ms) 대응 — window 접근은 effect 안에서만 (SSR 안전)
  useEffect(() => {
    const update = debounce(() => setIsMobile(isMobileViewport()), 300);
    setIsMobile(isMobileViewport());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // 원본: isMobileDisabled(springsConfig.disableOnMobile.hover || prop) — hover 전역 기본 true → ≤768px 무효
  const hoverDisabled = isMobile && (springsConfig.disableOnMobile.hover || disableOnMobile);

  // trigger ref가 주어지면 그 요소에 mouseenter/mouseleave 리스너 부착 (원본 로직)
  useEffect(() => {
    if (hoverDisabled) return;
    const el = trigger?.current;
    if (!el) return;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    el.addEventListener("mouseenter", enter);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mouseenter", enter);
      el.removeEventListener("mouseleave", leave);
    };
  }, [trigger, hoverDisabled]);

  const active = !hoverDisabled && hovered;

  // from/to는 CSS 변수("--lift" 등) 포함 원형 그대로 스프링에 통과 (원본과 동일)
  const spring = useSpring({
    from,
    to: active ? to : from,
    config,
  });

  const AnimatedTag = useMemo(() => animated(tag), [tag]) as ElementType;

  return (
    <AnimatedTag
      className={className}
      onMouseEnter={() => {
        if (!hoverDisabled && !trigger?.current) setHovered(true);
      }}
      onMouseLeave={() => {
        if (!hoverDisabled && !trigger?.current) setHovered(false);
      }}
      style={{ ...spring, ...style }}
    >
      {children}
    </AnimatedTag>
  );
}
