"use client";

// 원본 이식: docs/research/beautified/153s5cp_0jwcv.js 11219~11441행 HeroScene — 바닐라 three 은하 파티클 씬(렌더러·카메라·라이트·rAF·커서/스크롤 연동)
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createGalaxy } from "./galaxy";

/** 원본 r6.lerp(모듈 10738): (a, b, t) => a*(1-t) + b*t */
const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t;

export default function HeroScene({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // WebGL 미지원 — 원본과 동일하게 조용히 포기
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.set(0, 0, 15);
    scene.add(new THREE.AmbientLight(0xffffff, 1));
    for (const [x, y, z] of [
      [0, 0, 10],
      [-2, 0, 0],
      [2, 0, 0],
    ] as const) {
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(x, y, z);
      scene.add(light);
    }

    const galaxy = createGalaxy();
    galaxy.mesh.scale.setScalar(0.8);
    scene.add(galaxy.mesh);
    galaxy.startRender();

    // 커서 — p/f: uCursor용(초기 {10,10}=화면 밖), m/g: 원본에 있으나 읽지 않는 잔재(그대로 유지)
    const cursor = { x: 10, y: 10 };
    const cursorTarget = { x: 10, y: 10 };
    const aux = { x: 0, y: 0 };
    const auxTarget = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      cursorTarget.x = nx;
      cursorTarget.y = ny;
      auxTarget.x = nx;
      auxTarget.y = ny;
    };
    const onPointerLeave = () => {
      cursorTarget.x = 10;
      cursorTarget.y = 10;
      auxTarget.x = 0;
      auxTarget.y = 0;
    };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    const onResize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width !== 0 && height !== 0) {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };
    onResize();
    container.appendChild(renderer.domElement);
    window.addEventListener("resize", onResize);

    // 스크롤 진행도 기준 요소 — 원본: container.closest(".hero-region") ?? container
    const scrollRegion = container.closest(".hero-region") ?? container;
    const clock = new THREE.Clock();
    let rafId = 0;
    let smoothedProgress = 0;

    const tick = () => {
      if (!activeRef.current) {
        // active=false: 루프는 유지하되 연산·렌더 스킵 (재개 즉시)
        rafId = requestAnimationFrame(tick);
        return;
      }
      const rect = scrollRegion.getBoundingClientRect();
      const target = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
      const progress = (smoothedProgress = lerp(smoothedProgress, target, 0.1));
      const elapsed = clock.getElapsedTime();
      galaxy.render(elapsed);
      camera.position.z = 15 - 5 * progress;
      cursor.x += (cursorTarget.x - cursor.x) * 0.12;
      cursor.y += (cursorTarget.y - cursor.y) * 0.12;
      aux.x += (auxTarget.x - aux.x) * 0.08;
      aux.y += (auxTarget.y - aux.y) * 0.08;
      const shader = galaxy.shader.value;
      if (shader) {
        const uniforms = shader.uniforms;
        if (uniforms.universeIn) uniforms.universeIn.value = 1;
        if (uniforms.universeOut) uniforms.universeOut.value = 0.4 + 0.6 * progress;
        if (uniforms.uCursor) {
          uniforms.uCursor.value.x = cursor.x;
          uniforms.uCursor.value.y = cursor.y;
        }
        if (uniforms.uAspect) uniforms.uAspect.value = camera.aspect;
      }
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      galaxy.stopRender();
      galaxy.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className ? `hero-scene ${className}` : "hero-scene"}
      aria-hidden="true"
    />
  );
}
