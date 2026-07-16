"use client";

import { animated, useTransition } from "@react-spring/web";
import { SPRING } from "@/lib/springs";
import { useToast } from "@/stores/toast";

// 유래: docs/research/beautified/0gqnb4z11xdb6.js Toaster 모듈
// 원본은 단일 메시지·하단 중앙 translate(-50%) — 계약 스토어가 큐(스택) 방식이라
// 스펙대로 우하단 고정 스택으로 재구성. .toast의 원본 CSS(fixed·left:50%)는
// 스택 컨테이너와 충돌하므로 인라인 position:static으로 해제하고 시각 스타일만 재사용.
// 자동 dismiss(3400ms)는 스토어(@/stores/toast)가 담당.

export default function Toaster() {
  const toasts = useToast((s) => s.toasts);

  const transitions = useTransition(toasts, {
    keys: (t) => t.id,
    from: { opacity: 0, y: 16 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 16 },
    config: SPRING.toast, // {300, 26}
  });

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[110] flex flex-col items-end gap-2">
      {transitions((style, toast) => (
        <animated.div
          className="toast pointer-events-auto"
          role="alert"
          style={{
            position: "static",
            opacity: style.opacity,
            transform: style.y.to((y) => `translateY(${y}px)`),
          }}
        >
          {toast.message}
        </animated.div>
      ))}
    </div>
  );
}
