// 유래: docs/research/beautified/0y757sv-g.fer.js 모듈 31973 useScroll 이식 (계약 시그니처로 정리)
import { create } from "zustand";

interface ScrollState {
  isEnableScroll: boolean;
  setEnableScroll: (v: boolean) => void;
}

/** 순수 상태만 — html overflow 잠금 등 부수효과는 ScrollLayout이 담당 */
export const useScrollStore = create<ScrollState>((set) => ({
  isEnableScroll: true,
  setEnableScroll: (v) => set({ isEnableScroll: v }),
}));
