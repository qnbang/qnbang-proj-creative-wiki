"use client";
// 유래: docs/research/beautified/13m583hpf-38s.js — 모듈 69378 ProgressTrigger 내부 훅 이식.

import { useSpring } from "@react-spring/web";
import type { SpringValue } from "@react-spring/web";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";

interface UseProgressTriggerOptions {
  ref: RefObject<HTMLElement | null>;
  /** "(top|center|bottom) (top|center|bottom)" — 첫 단어=요소 기준점, 둘째=뷰포트 기준점. 기본 "top bottom" */
  start?: string;
  /** 기본 "bottom top" */
  end?: string;
  /** rAF 스로틀 간격(ms 경과 게이트, 원본 framerate 옵션). 기본 10 ≈ 매 프레임 실측 */
  frameInterval?: number;
  onChange?: (v: { progress: number; interpolatedProgress: number }) => void;
}

export function useProgressTrigger({
  ref,
  start = "top bottom",
  end = "bottom top",
  frameInterval = 10,
  onChange,
}: UseProgressTriggerOptions): SpringValue<number> {
  const lastProgress = useRef(-1);
  const intersecting = useRef(false);
  const ticksAfterExit = useRef(0);
  const keepTicking = useRef(true);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [{ interpolatedProgress }, api] = useSpring(() => ({ interpolatedProgress: 0 }));

  // IntersectionObserver: 화면 밖 이탈 시 카운터 리셋 → 10프레임(틱) 뒤 루프 휴면, 재진입 시 재개 (원본 로직)
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (intersecting.current !== entry.isIntersecting && !entry.isIntersecting) {
          ticksAfterExit.current = 0;
          keepTicking.current = true;
        }
        intersecting.current = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    if (ref.current) {
      io.observe(ref.current);
      ticksAfterExit.current = 0;
      keepTicking.current = true;
    }
    return () => io.disconnect();
  }, [ref]);

  // rAF 루프 — frameInterval(ms) 경과 시에만 rect 실측 (원본 로직·기준점 테이블 그대로)
  useEffect(() => {
    let rafId = 0;
    let last = performance.now();

    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // "요소기준_뷰포트기준" → 뷰포트 기준점 대비 부호 있는 거리
      const anchors: Record<string, number> = {
        top_top: rect.top,
        center_top: rect.top + rect.height / 2,
        bottom_top: rect.bottom,
        top_bottom: rect.top - vh,
        center_bottom: rect.top + rect.height / 2 - vh,
        bottom_bottom: rect.bottom - vh,
        top_center: rect.top - vh / 2,
        center_center: rect.top + rect.height / 2 - vh / 2,
        bottom_center: rect.bottom - vh / 2,
      };
      const startPos = anchors[start.split(" ").join("_")] ?? 0;
      const endPos = anchors[end.split(" ").join("_")] ?? 0;
      const span = Math.abs(startPos - endPos);
      // 원본 공식: progress = clamp(1 - (startPos + span) / span, 0, 1) (= -startPos/span)
      const progress = Math.min(Math.max(0, 1 - (startPos + span) / span), 1);
      if (progress !== lastProgress.current) {
        lastProgress.current = progress;
        api.start({ interpolatedProgress: progress });
        onChangeRef.current?.({ progress, interpolatedProgress: interpolatedProgress.get() });
      }
    };

    const loop = (now: number) => {
      if (now - last > frameInterval) {
        if (intersecting.current || keepTicking.current) {
          measure();
          if (!intersecting.current) {
            ticksAfterExit.current += 1;
            if (ticksAfterExit.current >= 10) keepTicking.current = false;
          }
        }
        last = performance.now();
      }
      rafId = requestAnimationFrame(loop);
    };
    loop(0);

    return () => cancelAnimationFrame(rafId);
  }, [ref, start, end, frameInterval, api, interpolatedProgress]);

  return interpolatedProgress;
}
