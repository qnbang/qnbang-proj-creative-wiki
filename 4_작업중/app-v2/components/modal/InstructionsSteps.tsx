"use client";
// 유래: docs/research/beautified/098-la-ts0ea1.js preview-block(C) 이식
// — 접힌 높이 112px, scrollHeight 실측(ResizeObserver), height/페이드 스프링 {tension:230, friction:28},
//   "Show all"/"Show less" 토글. 스텝 마크업은 ol.modal-steps > li.modal-step(번호 zero-pad).

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { JSX } from "react";
import { animated, useSpring } from "@react-spring/web";
import { SPRING } from "@/lib/springs";
import type { InstructionStep } from "./content";

export interface InstructionsStepsProps {
  title: string;
  subtitle?: string;
  steps: InstructionStep[];
  /** 원본 기본값 112px */
  collapsedHeight?: number;
}

export default function InstructionsSteps({
  title,
  subtitle,
  steps,
  collapsedHeight = 112,
}: InstructionsStepsProps): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const measure = () => setContentHeight(el.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [steps]);

  useEffect(() => {
    const onResize = () => {
      const el = contentRef.current;
      if (el) setContentHeight(el.scrollHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const collapsible = contentHeight > collapsedHeight;
  const targetHeight = expanded ? contentHeight : Math.min(collapsedHeight, contentHeight || collapsedHeight);

  const spring = useSpring({
    height: targetHeight,
    fadeOpacity: expanded || !collapsible ? 0 : 1,
    config: SPRING.accordion, // {tension:230, friction:28} — 원본 실측값
  });

  return (
    <div className="preview-block">
      <div className="preview-block-header">
        <div className="preview-block-titlebox">
          <p className="preview-block-title">{title}</p>
          {subtitle && <p className="preview-block-subtitle">{subtitle}</p>}
        </div>
      </div>
      <animated.div className="preview-block-body" style={{ height: spring.height }}>
        <div ref={contentRef} className="preview-block-content">
          <ol className="modal-steps">
            {steps.map((step, i) => (
              <li key={step.title} className="modal-step">
                <span className="modal-step-num" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="modal-step-title">{step.title}</p>
                  <p className="modal-step-text">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <animated.div className="preview-block-fade" aria-hidden="true" style={{ opacity: spring.fadeOpacity }} />
      </animated.div>
      {collapsible && (
        <button
          type="button"
          className="preview-block-toggle"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "접기" : "전체 보기"}
          <span aria-hidden="true" className="preview-block-toggle-caret">
            <svg viewBox="0 0 16 16" fill="none">
              <path
                d={expanded ? "M4 9.5L8 5.5L12 9.5" : "M4 6.5L8 10.5L12 6.5"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
