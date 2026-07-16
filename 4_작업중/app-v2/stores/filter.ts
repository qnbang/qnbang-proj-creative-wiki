// 헤더 캡슐 네비(도메인 퀵링크)와 ProjectsGrid 필터탭이 공유하는 활성 도메인 필터.
// 원본 클론엔 없던 스토어 — Header ↔ Grid가 별도 컴포넌트라 zustand로 공유해야 nav 클릭이 그리드에 반영된다.
import { create } from "zustand";
import type { FilterKey } from "@/lib/types";

interface FilterState {
  filter: FilterKey;
  setFilter: (key: FilterKey) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  filter: "all",
  setFilter: (key) => set({ filter: key }),
}));
