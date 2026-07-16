// 유래: docs/research/beautified/0ru9lekhq5wzu.js 모듈 8406 useToast 이식 (계약: 큐 방식 + 3400ms 자동 dismiss)
import { create } from "zustand";

interface Toast {
  id: number;
  message: string;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string) => void;
  dismiss: (id: number) => void;
}

let nextId = 0;

export const useToast = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message) => {
    const id = ++nextId;
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => get().dismiss(id), 3400);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
