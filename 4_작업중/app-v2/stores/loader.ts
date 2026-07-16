// 유래: docs/research/beautified/0y757sv-g.fer.js 모듈 8388 useLoaderState 이식
import { create } from "zustand";

interface LoaderState {
  complete: boolean;
  markComplete: () => void;
}

export const useLoaderState = create<LoaderState>((set) => ({
  complete: false,
  markComplete: () => set({ complete: true }),
}));
