"use client";
// 유래: 098-la-ts0ea1.js 모듈 75893 d(Dropdown) 이식 — useTransition {320,28} 스케일 페이드

import { useEffect, useRef, useState } from "react";
import { animated, useTransition } from "@react-spring/web";
import { SPRING } from "@/lib/springs";
import type { SortMode } from "@/lib/types";

const OPTIONS: SortMode[] = ["Popular", "Recent"];
// 정렬 값(SortMode) 자체는 내부 로직(lib/projects.ts sortProjects)이 참조하는 키라 영문 유지,
// 화면 표시 라벨만 한글화(사용자 반려 2026-07-16: 영문 UI 잔재).
const SORT_LABELS: Record<SortMode, string> = { Popular: "인기순", Recent: "최신순" };

function ChevronIcon() {
  return (
    <svg className="dropdown-chevron" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5 6 8l3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SortDropdownProps {
  value: SortMode;
  onChange: (value: SortMode) => void;
}

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  const transitions = useTransition(open, {
    from: { opacity: 0, scale: 0.95 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0.96 },
    config: SPRING.dropdown,
  });

  return (
    <div ref={rootRef} className="dropdown">
      <button
        type="button"
        className="dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {SORT_LABELS[value]}
        <ChevronIcon />
      </button>
      {transitions((style, show) =>
        show ? (
          <animated.div
            className="dropdown-menu"
            role="listbox"
            style={{ opacity: style.opacity, transform: style.scale.to((s) => `scale(${s})`) }}
          >
            {OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                role="option"
                aria-selected={option === value}
                className={`dropdown-option ${option === value ? "dropdown-option-active" : ""}`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {SORT_LABELS[option]}
              </button>
            ))}
          </animated.div>
        ) : null
      )}
    </div>
  );
}
