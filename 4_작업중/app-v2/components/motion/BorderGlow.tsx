"use client";
// 유래: docs/research/beautified/0y757sv-g.fer.js 모듈 22263 BorderGlow 이식

import { useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { useSpring } from "@react-spring/web";
import { useIsStaticMode } from "@/components/motion/RenderModeProvider";

interface BorderGlowProps {
  variant?: "button" | "card-sm" | "card-lg" | "button-lg";
  className?: string;
}

const DURATION = 4200;
const BLOB_OFFSET = 0.5;

/**
 * 둥근사각형 둘레(직선 4 + 코너 원호 4) 매개변수화 — t(0~1) → 테두리 위 (x,y).
 * 원본 로직 그대로: 상변→우상호→우변→우하호→하변→좌하호→좌변→좌상호 순회.
 */
function pointOnRoundedRect(t: number, w: number, h: number, r: number): { x: number; y: number } {
  const straightW = w - 2 * r;
  const straightH = h - 2 * r;
  const arc = (Math.PI / 2) * r;
  const perimeter = 2 * straightW + 2 * straightH + 4 * arc;
  if (perimeter <= 0) return { x: 0, y: 0 };
  let s = (((t % 1) * perimeter) + perimeter) % perimeter;
  if (s < straightW) return { x: r + s, y: 0 };
  s -= straightW;
  if (s < arc) {
    const a = -Math.PI / 2 + (Math.PI / 2) * (s / arc);
    return { x: w - r + r * Math.cos(a), y: r + r * Math.sin(a) };
  }
  s -= arc;
  if (s < straightH) return { x: w, y: r + s };
  s -= straightH;
  if (s < arc) {
    const a = (Math.PI / 2) * (s / arc);
    return { x: w - r + r * Math.cos(a), y: h - r + r * Math.sin(a) };
  }
  s -= arc;
  if (s < straightW) return { x: w - r - s, y: h };
  s -= straightW;
  if (s < arc) {
    const a = Math.PI / 2 + (Math.PI / 2) * (s / arc);
    return { x: r + r * Math.cos(a), y: h - r + r * Math.sin(a) };
  }
  s -= arc;
  if (s < straightH) return { x: 0, y: h - r - s };
  s -= straightH;
  const a = Math.PI + (Math.PI / 2) * (s / arc);
  return { x: r + r * Math.cos(a), y: r + r * Math.sin(a) };
}

export default function BorderGlow({ variant, className }: BorderGlowProps): JSX.Element {
  const isStatic = useIsStaticMode();
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const blobARef = useRef<HTMLSpanElement | null>(null);
  const blobBRef = useRef<HTMLSpanElement | null>(null);
  const dimsRef = useRef({ w: 0, h: 0, cr: 0 });
  const tRef = useRef(0);
  const [visible, setVisible] = useState(false);

  /** 현재 치수 기준으로 블롭 transform을 ref.style에 직접 세팅 (리렌더 없음) */
  const writeBlob = (el: HTMLSpanElement | null, t: number) => {
    if (!el) return;
    const { w, h, cr } = dimsRef.current;
    const p = pointOnRoundedRect(t % 1, w, h, cr);
    el.style.transform = `translate(-50%, -50%) translate(${p.x}px, ${p.y}px)`;
  };

  useSpring({
    from: { t: 0 },
    to: { t: 1 },
    loop: true,
    config: { duration: DURATION }, // duration 지정 → linear
    pause: isStatic || !visible,
    onChange: (result) => {
      const t = (result.value as { t: number }).t;
      tRef.current = t;
      writeBlob(blobARef.current, t);
      writeBlob(blobBRef.current, t + BLOB_OFFSET);
    },
  });

  useEffect(() => {
    const host = rootRef.current;
    const parent = host?.parentElement;
    if (!host || !parent) return;

    // 부모 요소 width/height/border-radius 실측 (cr은 w/2·h/2로 클램프 — 원본 로직)
    const measure = () => {
      const w = parent.offsetWidth;
      const h = parent.offsetHeight;
      const cr = Math.min(parseFloat(getComputedStyle(parent).borderTopLeftRadius) || 0, w / 2, h / 2);
      dimsRef.current = { w, h, cr };
      writeBlob(blobARef.current, tRef.current);
      writeBlob(blobBRef.current, tRef.current + BLOB_OFFSET);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(parent);

    if (isStatic) return () => ro.disconnect(); // 정적 모드: t=0 고정 배치, IO 불필요

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setVisible(entry.isIntersecting);
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(host);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
    // writeBlob은 ref만 참조 — 의존성 불필요
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isStatic]);

  const cls = ["border-glow", variant ? `border-glow-${variant}` : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <span ref={rootRef} className={cls} aria-hidden="true">
      <span
        ref={blobARef}
        className="border-glow-blob"
        style={{ transform: "translate(-50%, -50%) translate(0px, 0px)" }}
      />
      <span
        ref={blobBRef}
        className="border-glow-blob"
        style={{ transform: "translate(-50%, -50%) translate(0px, 0px)" }}
      />
    </span>
  );
}
