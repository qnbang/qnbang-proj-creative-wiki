"use client";
// 유래: 098-la-ts0ea1.js 모듈 75893 P/U(스토리지 헬퍼)·ee(훅) 이식
// localStorage "gl-recently-viewed" 최대 10개 — 라이브 사이트는 사이드바 상단에 표시(스펙 실측)

import { useEffect, useMemo, useState } from "react";
import { getProject } from "@/lib/projects";
import type { Project } from "@/lib/types";

const STORAGE_KEY = "gl-recently-viewed";
const CHANGE_EVENT = "gl-recently-viewed-changed";
const MAX_ENTRIES = 10;
const MAX_DISPLAY = 8;

interface RecentEntry {
  id: string;
  viewedAt: number;
}

function readEntries(): RecentEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is RecentEntry =>
        typeof (entry as RecentEntry)?.id === "string" && typeof (entry as RecentEntry)?.viewedAt === "number"
    );
  } catch {
    return [];
  }
}

/** 최근 본 프로젝트 기록 — 중복 제거 후 선두 삽입, 최대 10개 (모달 오픈 시 호출) */
export function recordRecentlyViewed(id: string): void {
  if (typeof window === "undefined") return;
  const next = [{ id, viewedAt: Date.now() }, ...readEntries().filter((entry) => entry.id !== id)]
    .sort((a, b) => b.viewedAt - a.viewedAt)
    .slice(0, MAX_ENTRIES);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 저장소 접근 불가 — 무시
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

function clearRecentlyViewed(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 저장소 접근 불가 — 무시
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
}

interface RecentlyViewedProps {
  /** 항목 클릭 → 해당 프로젝트 모달 오픈 */
  onSelect: (project: Project) => void;
}

export default function RecentlyViewed({ onSelect }: RecentlyViewedProps) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const update = () => setIds(readEntries().map((entry) => entry.id));
    update();
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) update();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener(CHANGE_EVENT, update);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(CHANGE_EVENT, update);
    };
  }, []);

  const items = useMemo(
    () => ids.map((id) => getProject(id)).filter((project): project is Project => !!project),
    [ids]
  );

  if (items.length === 0) return null;

  return (
    <div className="recently-viewed mb-6" aria-label="Recently viewed">
      <div className="flex items-center justify-between gap-2">
        <p className="recently-viewed-label">Recently viewed</p>
        <button
          type="button"
          className="recently-viewed-chip"
          onClick={clearRecentlyViewed}
          aria-label="Reset recently viewed"
          title="Reset recently viewed"
        >
          <span aria-hidden="true">↻</span>
        </button>
      </div>
      <div className="recently-viewed-row">
        {items.slice(0, MAX_DISPLAY).map((project) => (
          <button
            key={project.id}
            type="button"
            className="recently-viewed-chip"
            title={project.title}
            onClick={() => onSelect(project)}
          >
            {project.title}
          </button>
        ))}
      </div>
    </div>
  );
}
