"use client";
// 유래: 098-la-ts0ea1.js 모듈 75893 m(FilterTabs) 이식 — 가로(filter-tab)/세로(filter-tab-v) 겸용

import { CATEGORY_LABELS } from "@/lib/projects";
import { DOMAIN_ORDER } from "@/lib/wiki-meta";
import type { FilterKey } from "@/lib/types";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  ...DOMAIN_ORDER.map((key) => ({ key, label: CATEGORY_LABELS[key] })),
  { key: "bookmarked", label: "내 보드" },
];

interface FilterTabsProps {
  active: FilterKey;
  counts: Record<FilterKey, number>;
  onSelect: (key: FilterKey) => void;
  orientation?: "horizontal" | "vertical";
}

export default function FilterTabs({ active, counts, onSelect, orientation = "horizontal" }: FilterTabsProps) {
  const base = orientation === "vertical" ? "filter-tab-v" : "filter-tab";
  const activeClass = orientation === "vertical" ? "filter-tab-v-active" : "filter-tab-active";
  return (
    <>
      {FILTERS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={active === key}
          className={`${base} ${active === key ? activeClass : ""}`}
          onClick={() => onSelect(key)}
        >
          <span className="filter-tab-label">{label}</span>
          <span className="filter-count">({counts[key] ?? 0})</span>
        </button>
      ))}
    </>
  );
}
