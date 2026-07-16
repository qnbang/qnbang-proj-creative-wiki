"use client";
// 유래: docs/research/beautified/0ru9lekhq5wzu.js — 모듈 23301 Spring(+79050 springsConfig·48097 useWindowWidth) 이식. 인뷰 트리거(IO/scroll) 내장형.

import { animated, to as springTo, useSpring } from "@react-spring/web";
import type { SpringValue } from "@react-spring/web";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ElementType, JSX, ReactNode } from "react";
import { useIsStaticMode } from "@/components/motion/RenderModeProvider";
import { isMobileViewport, springsConfig } from "@/lib/springs";
import { debounce } from "@/lib/utils";

export interface SpringStyleTarget {
  opacity?: number;
  y?: number;
  x?: number;
  scale?: number;
  blur?: number;
  [cssVar: `--${string}`]: string | number | undefined;
}

interface SpringProps {
  tag?: ElementType;
  from: SpringStyleTarget;
  to: SpringStyleTarget;
  mode?: "always" | "once" | "forward";
  config?: { tension: number; friction: number };
  delayIn?: number;
  delayOut?: number;
  enabled?: boolean;
  disableOnMobile?: boolean;
  immediateOut?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const TRANSFORM_KEYS: readonly string[] = ["x", "y", "scale"];

export default function Spring({
  tag = "div",
  from,
  to,
  mode = "once",
  config,
  delayIn = 0,
  delayOut = 0,
  enabled = true,
  disableOnMobile = false,
  immediateOut = false,
  className,
  style,
  children,
}: SpringProps): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const isStatic = useIsStaticMode();
  const [isMobile, setIsMobile] = useState(false);
  const [triggered, setTriggered] = useState(false);

  // 원본 useWindowWidth(debounce 300ms) 대응 — window 접근은 effect 안에서만 (SSR 안전)
  useEffect(() => {
    const update = debounce(() => setIsMobile(isMobileViewport()), 300);
    setIsMobile(isMobileViewport());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const mobileDisabled = isMobile && (springsConfig.disableOnMobile.spring || disableOnMobile);
  // 고정 조건: static 모드 · enabled=false · 모바일 비활성 → 애니메이션 없이 to 고정(즉시)
  const fixed = isStatic || !enabled || mobileDisabled;

  // mode "once"/"always": IntersectionObserver 진입 감지 ("once"는 1회 후 유지, "always"는 왕복)
  useEffect(() => {
    if (fixed || mode === "forward") return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry) return;
      if (entry.isIntersecting) {
        setTriggered(true);
        if (mode === "once") io.disconnect();
      } else if (mode === "always") {
        setTriggered(false);
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [mode, fixed]);

  // mode "forward": 스크롤 리스너로 요소 top>0 여부 추적 — 뷰포트 위로 지나간(top<=0) 요소는 to 유지 (원본 로직)
  useEffect(() => {
    if (fixed || mode !== "forward") return;
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const passed = el.getBoundingClientRect().top <= 0;
      setTriggered((prev) => (prev === passed ? prev : passed));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [mode, fixed]);

  const active = fixed || triggered;

  // from/to에 등장하는 키만 스프링 값으로 구성 (한쪽에만 있으면 반대편 값으로 보충)
  const fromRec = from as Record<string, string | number | undefined>;
  const toRec = to as Record<string, string | number | undefined>;
  const keys = Array.from(new Set([...Object.keys(from), ...Object.keys(to)]));
  const hasTransform = keys.some((k) => TRANSFORM_KEYS.includes(k));
  const fromValues: Record<string, string | number> = {};
  const toValues: Record<string, string | number> = {};
  if (hasTransform) {
    // 합성 transform 축 기본값 (x/y = 0px, scale = 1)
    fromValues.x = 0;
    fromValues.y = 0;
    fromValues.scale = 1;
    toValues.x = 0;
    toValues.y = 0;
    toValues.scale = 1;
  }
  for (const k of keys) {
    const f = fromRec[k] ?? toRec[k];
    const t = toRec[k] ?? fromRec[k];
    if (f !== undefined) fromValues[k] = f;
    if (t !== undefined) toValues[k] = t;
  }

  const spring = useSpring({
    from: fromValues,
    to: active ? toValues : fromValues,
    config,
    delay: fixed ? 0 : active ? delayIn : delayOut,
    immediate: fixed || (!active && immediateOut), // 원본: immediate = !active && immediateOut
  });
  const sv = spring as unknown as Record<string, SpringValue<number>>;

  // 스타일 매핑: opacity 직접 · y/x px translate3d + scale 합성 · blur → filter blur(px) · --* 변수 통과
  const animatedStyle: Record<string, unknown> = {};
  const willChange: string[] = [];
  if (keys.includes("opacity")) {
    animatedStyle.opacity = sv.opacity;
    willChange.push("opacity");
  }
  if (hasTransform) {
    animatedStyle.transform = springTo(
      [sv.x, sv.y, sv.scale],
      (x, y, s) => `translate3d(${x}px, ${y}px, 0) scale(${s})`,
    );
    willChange.push("transform");
  }
  if (keys.includes("blur")) {
    animatedStyle.filter = sv.blur.to((b) => `blur(${b}px)`);
    willChange.push("filter");
  }
  for (const k of keys) {
    if (k.startsWith("--")) animatedStyle[k] = sv[k];
  }
  if (!fixed && willChange.length > 0) animatedStyle.willChange = willChange.join(", ");

  const AnimatedTag = useMemo(() => animated(tag), [tag]) as ElementType;

  return (
    <AnimatedTag ref={ref} className={className} style={{ ...animatedStyle, ...style }}>
      {children}
    </AnimatedTag>
  );
}
