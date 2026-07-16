"use client";
// 유래: 098-la-ts0ea1.js 모듈 75893 aside.filter-sidebar 이식 — Spring {140,24} y24 리빌
// 라이브 사이트 실측: 사이드바 상단에 RECENTLY VIEWED, 아래 Categories + 세로 탭 4개

import Spring from "@/components/motion/Spring";
import type { FilterKey, Project } from "@/lib/types";
import FilterTabs from "./FilterTabs";
import RecentlyViewed from "./RecentlyViewed";

const SIDEBAR_FROM = { opacity: 0, y: 24 };
const SIDEBAR_TO = { opacity: 1, y: 0 };
const SIDEBAR_CONFIG = { tension: 140, friction: 24 };

interface FilterSidebarProps {
  active: FilterKey;
  counts: Record<FilterKey, number>;
  onSelect: (key: FilterKey) => void;
  /** 최근 본 항목 클릭 → 모달 오픈 */
  onOpenProject: (project: Project) => void;
}

export default function FilterSidebar({ active, counts, onSelect, onOpenProject }: FilterSidebarProps) {
  return (
    <Spring
      tag="aside"
      mode="once"
      from={SIDEBAR_FROM}
      to={SIDEBAR_TO}
      config={SIDEBAR_CONFIG}
      className="filter-sidebar"
    >
      <RecentlyViewed onSelect={onOpenProject} />
      <p className="filter-sidebar-title">카테고리</p>
      <div className="flex flex-col" role="tablist">
        <FilterTabs active={active} counts={counts} onSelect={onSelect} orientation="vertical" />
      </div>
    </Spring>
  );
}
