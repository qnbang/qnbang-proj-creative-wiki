"use client";

// 원본: 098-la-ts0ea1.js HomeHero — 텍스트 스태거 {tension:110,friction:26}, delayIn 0/90/180/270
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Spring from "@/components/motion/Spring";
import Hover from "@/components/motion/Hover";
import BorderGlow from "@/components/motion/BorderGlow";
import AnimatedSpark from "@/components/motion/AnimatedSpark";
import { useLoaderState } from "@/stores/loader";
import { SPRING } from "@/lib/springs";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const HERO = {
  titleLead: "흩어진 창작 지식을,",
  titleAccent: "하나의 인덱스로.",
  subtitle: "381개의 개념·이론·사례를 정설성 표시와 함께 훑고, 필요한 순간 바로 꺼내 쓴다.",
  cta: "전체 항목 보기",
};

/** 로더 완료 전엔 from 상태로 고정, 완료 후 Spring(mode always — 즉시 뷰포트 안이므로 바로 발동) */
function GatedSpring({
  gate,
  from,
  to,
  delayIn,
  tag,
  className,
  children,
}: {
  gate: boolean;
  from: Record<string, number>;
  to: Record<string, number>;
  delayIn: number;
  tag?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = (tag ?? "div") as React.ElementType;
  if (!gate) {
    return (
      <Tag
        className={className}
        style={{
          opacity: from.opacity ?? 1,
          transform: from.y ? `translate3d(0,${from.y}px,0)` : undefined,
        }}
      >
        {children}
      </Tag>
    );
  }
  return (
    <Spring tag={tag} from={from} to={to} mode="always" config={SPRING.heroText} delayIn={delayIn} className={className}>
      {children}
    </Spring>
  );
}

export default function HomeHero() {
  const complete = useLoaderState((s) => s.complete);
  const regionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [sceneEnabled, setSceneEnabled] = useState(false);
  const [sceneActive, setSceneActive] = useState(true);

  // HeroScene은 데스크톱(≥1280px)에서만 lazy 마운트, IO(rootMargin 100px)로 active 토글 (원본)
  useEffect(() => {
    if (window.innerWidth < 1280) return;
    setSceneEnabled(true);
    const el = regionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setSceneActive(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // --hero-drift: 포인터 x 비율(0~1)을 lerp로 스무딩해 CSS 변수 주입 (원본 radial-gradient 연동)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let target = 0.5;
    let current = 0.5;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      target = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    };
    const onLeave = () => {
      target = 0.5;
    };
    const loop = () => {
      current += (target - current) * 0.08;
      stage.style.setProperty("--hero-drift", current.toFixed(4));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section className="hero-region" ref={regionRef}>
      <div className="hero-stage" ref={stageRef}>
        {sceneEnabled && <HeroScene active={sceneActive} />}
        <div className="hero-content">
          {/* 위키 v2: 장식용 eyebrow 필(도메인 나열) 제거 — 탐색에 기능하지 않는 요약은 넣지 않는다.
              도메인 나열은 필터 탭이, 항목 수는 필터 탭 카운트가 이미 한다(사용자 반려 2026-07-16). */}
          <GatedSpring
            gate={complete}
            tag="h1"
            from={{ opacity: 0, y: 12 }}
            to={{ opacity: 1, y: 0 }}
            delayIn={0}
            className="hero-title sm:whitespace-nowrap"
          >
            {HERO.titleLead} <br className="sm:hidden" aria-hidden="true" />
            <span className="hero-title-accent">{HERO.titleAccent}</span>
          </GatedSpring>
          <GatedSpring
            gate={complete}
            tag="p"
            from={{ opacity: 0, y: 12 }}
            to={{ opacity: 1, y: 0 }}
            delayIn={90}
            className="hero-subtitle mt-5 max-w-md text-pretty"
          >
            {HERO.subtitle}
          </GatedSpring>
          <GatedSpring gate={complete} from={{ opacity: 0, y: 14 }} to={{ opacity: 1, y: 0 }} delayIn={180} className="mt-9">
            <a className="btn-link" href="#projects">
              <Hover
                tag="span"
                from={{ "--btn-hover": 0 }}
                to={{ "--btn-hover": 1 }}
                config={SPRING.buttonHover}
                className="btn btn-silver btn-with-icon"
              >
                <BorderGlow variant="button" />
                <span className="btn-label">{HERO.cta}</span>
                <span className="btn-icon-circle">
                  <AnimatedSpark />
                </span>
              </Hover>
            </a>
          </GatedSpring>
        </div>
      </div>
    </section>
  );
}
