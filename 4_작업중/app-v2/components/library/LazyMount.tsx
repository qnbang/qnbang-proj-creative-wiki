"use client";
// 유래: 098-la-ts0ea1.js 모듈 75893 eR(지연 마운트) 이식 — IO rootMargin 1200px, 미도달 시 스켈레톤

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface LazyMountProps {
  eager: boolean;
  children: ReactNode;
}

export default function LazyMount({ eager, children }: LazyMountProps) {
  const [mounted, setMounted] = useState(eager);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (mounted) return;
    const el = placeholderRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "1200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  if (mounted) return <>{children}</>;

  return (
    <div ref={placeholderRef} className="glass glass-card flex h-full flex-col p-2 animate-pulse" aria-hidden="true">
      <div className="card-thumb aspect-[960/684]" />
      <div className="flex min-h-[5rem] flex-col px-1.5 pb-1 pt-3" />
    </div>
  );
}
