import raw from "./projects-data.json";
import { DOMAIN_LABELS, DOMAIN_ORDER } from "./wiki-meta";
import type { DomainKey, FilterKey, Project, SortMode } from "./types";

// 위키 콘텐츠는 전부 로컬 svg/html 인라인이거나 외부(위키미디어 등) URL — Supabase 스토리지 재작성 불필요.
export const projects: Project[] = raw as Project[];

export const CATEGORY_LABELS: Record<DomainKey, string> = DOMAIN_LABELS;

export function filterProjects(list: Project[], filter: FilterKey, bookmarked?: Set<string>): Project[] {
  if (filter === "all") return list;
  if (filter === "bookmarked") return bookmarked ? list.filter((p) => bookmarked.has(p.id)) : [];
  return list.filter((p) => p.category === filter);
}

/** 원본 "fresh" 판정을 위키 콘텐츠로 단순화 — createdAt이 최근이면 신규(사실상 항목 전부가 과거 연도라 상시 false) */
function isFresh(p: Project): boolean {
  return isNew(p);
}

/** 원본 정렬 유지: fresh 우선 → Popular는 likes desc·createdAt desc / Recent는 createdAt desc */
export function sortProjects(list: Project[], mode: SortMode, _filter: FilterKey = "all"): Project[] {
  const byRecent = (a: Project, b: Project) => b.createdAt.localeCompare(a.createdAt);
  const sorted = [...list];
  if (mode === "Recent") {
    sorted.sort((a, b) => {
      const fa = isFresh(a);
      if (fa !== isFresh(b)) return fa ? -1 : 1;
      return byRecent(a, b);
    });
  } else {
    sorted.sort((a, b) => {
      const fa = isFresh(a);
      const fb = isFresh(b);
      if (fa !== fb) return fa ? -1 : 1;
      if (fa && fb) return byRecent(a, b);
      return b.likes - a.likes || byRecent(a, b);
    });
  }
  return sorted;
}

/** NEW 뱃지 — createdAt이 UTC 기준 7일 전 날짜 문자열 이상 (원본 로직 그대로) */
export function isNew(p: Project | string): boolean {
  const createdAt = typeof p === "string" ? p : p.createdAt;
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 7);
  return createdAt >= d.toISOString().slice(0, 10);
}

export function getProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id);
}

export function categoryCounts(): Record<DomainKey | "all", number> {
  const counts = { all: projects.length } as Record<DomainKey | "all", number>;
  for (const domain of DOMAIN_ORDER) counts[domain] = 0;
  for (const p of projects) counts[p.category]++;
  return counts;
}
