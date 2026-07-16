"use client";
// 유래: docs/research/beautified/13m583hpf-38s.js — 모듈 90386 BlurWords·BlurBlock 이식.

import { animated } from "@react-spring/web";
import type { SpringValue } from "@react-spring/web";
import { Fragment, useMemo } from "react";
import type { ElementType, JSX, ReactNode } from "react";
import { useIsStaticMode } from "@/components/motion/RenderModeProvider";
import { clamp } from "@/lib/utils";

interface BlurWordsProps {
  text: string;
  progress: SpringValue<number>;
  blur?: number;
  yOffset?: number;
  rampWidth?: number;
  unrevealAt?: number;
  exit?: boolean;
  className?: string;
  tag?: ElementType;
}

/** 단어별 blur 리빌 — progress.to(...) 파생으로 리렌더 없이 구동 (원본 공식·수치 그대로) */
export function BlurWords({
  text,
  progress,
  blur = 14,
  yOffset = 12,
  rampWidth = 0.18,
  unrevealAt = 0.7,
  exit = true,
  className,
  tag,
}: BlurWordsProps): JSX.Element {
  const isStatic = useIsStaticMode();
  const tokens = useMemo(() => text.split(/(\s+)/), [text]);
  const wordCount = useMemo(() => tokens.filter((t) => t.trim().length > 0).length, [tokens]);
  const Tag = (tag ?? "span") as ElementType;

  if (isStatic) return <Tag className={className}>{text}</Tag>;

  const denom = Math.max(1, wordCount - 1);
  let wordIndex = -1;

  return (
    <Tag className={className}>
      {tokens.map((token, i) => {
        // 공백 토큰은 그대로 보존
        if (!token.trim()) return <Fragment key={i}>{token}</Fragment>;
        const idx = ++wordIndex;
        // 단어 i 시작점 = i/(n-1) * min(.25, unrevealAt - rampWidth), 폭 rampWidth (원본 공식)
        const revealStart = (idx / denom) * Math.min(0.25, Math.max(0.01, unrevealAt - rampWidth));
        const revealEnd = revealStart + rampWidth;
        // exit 램프: unrevealAt부터 단어별로 시차를 두고 역방향 소멸 (원본 공식)
        const exitSpread = Math.min(0.25, Math.max(0.01, 1 - unrevealAt - rampWidth));
        const exitStart = unrevealAt + (idx / denom) * exitSpread;
        const exitEnd = exitStart + rampWidth;
        const ramp = (p: number) =>
          clamp((p - revealStart) / (revealEnd - revealStart), 0, 1) *
          (1 - (exit ? clamp((p - exitStart) / (exitEnd - exitStart), 0, 1) : 0));
        return (
          <animated.span
            key={i}
            style={{
              display: "inline-block",
              opacity: progress.to((p) => ramp(p)),
              filter: progress.to((p) => `blur(${(1 - ramp(p)) * blur}px)`),
              transform: progress.to((p) => `translateY(${(1 - ramp(p)) * yOffset}px)`),
              willChange: "opacity, transform, filter",
            }}
          >
            {token}
          </animated.span>
        );
      })}
    </Tag>
  );
}

interface BlurBlockProps {
  children: ReactNode;
  progress: SpringValue<number>;
  blur?: number;
  yOffset?: number;
  rampWidth?: number;
  className?: string;
}

/** 블록 단위 blur 리빌 — 내부 고정값 unrevealAt .7 · exit 역방향 소멸 (원본 기본값) */
export function BlurBlock({
  children,
  progress,
  blur = 16,
  yOffset = 14,
  rampWidth = 0.22,
  className,
}: BlurBlockProps): JSX.Element {
  const isStatic = useIsStaticMode();

  if (isStatic) return <div className={className}>{children}</div>;

  const unrevealAt = 0.7;
  const ramp = (p: number) =>
    clamp(p / Math.max(0.01, rampWidth), 0, 1) *
    (1 - clamp((p - unrevealAt) / Math.max(0.01, 1 - unrevealAt), 0, 1));

  return (
    <animated.div
      className={className}
      style={{
        opacity: progress.to((p) => ramp(p)),
        filter: progress.to((p) => `blur(${(1 - ramp(p)) * blur}px)`),
        transform: progress.to((p) => `translateY(${(1 - ramp(p)) * yOffset}px)`),
        willChange: "opacity, transform, filter",
      }}
    >
      {children}
    </animated.div>
  );
}
