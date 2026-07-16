// 유래: 원본 useAuth favorites(0ru9lekhq5wzu.js 모듈 14283)의 로컬 목업.
// 위키 v2: 하트("좋아요")→북마크("내 보드")로 의미 교체 — 저장 메커니즘(localStorage, zustand API)은 그대로 재사용.
import { create } from "zustand";

const STORAGE_KEY = "wiki-bookmarks";

interface LikesState {
  liked: Record<string, true>;
  toggle: (id: string) => void;
  hydrate: () => void;
}

/** liked 맵 → string[] 직렬화 저장 (SSR 안전: 호출 시점에만 localStorage 접근) */
function persist(liked: Record<string, true>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.keys(liked)));
  } catch {
    // 저장소 접근 불가(시크릿 모드 등) — 상태만 유지
  }
}

export const useLikes = create<LikesState>((set, get) => ({
  liked: {},
  hydrate: () => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const ids: unknown = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(ids)) return;
      const liked: Record<string, true> = {};
      for (const id of ids) {
        if (typeof id === "string") liked[id] = true;
      }
      set({ liked });
    } catch {
      // 파싱·접근 실패 시 빈 상태 유지
    }
  },
  toggle: (id) => {
    const liked = { ...get().liked };
    if (liked[id]) {
      delete liked[id];
    } else {
      liked[id] = true;
    }
    set({ liked });
    persist(liked);
  },
}));

/** 표시용 좋아요 수 — base + (내가 눌렀으면 1) */
export function likesDisplay(base: number, liked: boolean): number {
  return base + (liked ? 1 : 0);
}
