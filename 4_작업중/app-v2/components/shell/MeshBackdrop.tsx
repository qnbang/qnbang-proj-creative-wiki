"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { useIsStaticMode } from "@/components/motion/RenderModeProvider";
import { SPRING } from "@/lib/springs";

// 유래: docs/research/beautified/0eyuznej1vvzm.js (MeshBackdrop)
// 원본과 동일하게 dynamic(ssr:false)로 셰이더 청크 지연 로드.

const MeshGradient = dynamic(() => import("@paper-design/shaders-react").then((m) => m.MeshGradient), {
  ssr: false,
});

const COLORS = ["#0c0d10", "#06070a", "#06070a", "#2e333d", "#586575"];

export default function MeshBackdrop() {
  const isStatic = useIsStaticMode();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false); // 셰이더 마운트 여부
  const [ready, setReady] = useState(false); // rAF 2프레임 후 페이드인 시작

  // IO 2중: 진입(rootMargin 50%) → 마운트 / 이탈(rootMargin 100%) → 언마운트.
  // fixed inset-0 요소라 사실상 상시 교차하지만 원본 구조 유지.
  useEffect(() => {
    if (isStatic) return;
    const el = ref.current;
    if (!el) return;
    const enter = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setMounted(true);
      },
      { rootMargin: "50% 0px 50% 0px" }
    );
    enter.observe(el);
    const exit = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) {
          setMounted(false);
          setReady(false);
        }
      },
      { rootMargin: "100% 0px 100% 0px" }
    );
    exit.observe(el);
    return () => {
      enter.disconnect();
      exit.disconnect();
    };
  }, [isStatic]);

  // 마운트 후 rAF 2프레임 뒤 페이드인 (원본 동일)
  useEffect(() => {
    if (!mounted) return;
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setReady(true));
    });
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  const fade = useSpring({ opacity: ready ? 1 : 0, config: SPRING.meshFade }); // {120, 28}

  // 정적 모드에선 렌더하지 않음 (스펙)
  if (isStatic) return null;

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 select-none">
      {mounted && (
        <animated.div style={{ opacity: fade.opacity }} className="absolute inset-0">
          <MeshGradient
            colors={COLORS}
            speed={0.18}
            distortion={0.95}
            swirl={0.18}
            grainOverlay={0.04}
            style={{ width: "100%", height: "100%" }}
          />
        </animated.div>
      )}
    </div>
  );
}
