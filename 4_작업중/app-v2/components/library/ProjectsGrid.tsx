"use client";
// 유래: docs/research/beautified/098-la-ts0ea1.js 모듈 75893 ProjectsGrid 이식
// section#projects — pill 리빌 → BlurWords 타이틀(진행도 트리거) → 검색·정렬 드롭다운 →
// 모바일 가로탭/데스크톱 사이드바 → 카드 그리드(지연 마운트) → 모달(?layer= 딥링크)
// 위키 v2 변경점: 배너 카드(goUnlimited/hireUs/subscribe — Pricing·뉴스레터 CTA) 삽입 제거,
// 필터를 도메인 5개 + "내 보드"(북마크)로 교체, Header 캡슐 네비와 zustand filter 스토어 공유,
// 원본에 없던 검색 입력을 dropdown-trigger와 같은 glass 톤(subscribe-input)으로 최소 추가.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SpringValue } from "@react-spring/web";
import { BlurWords } from "@/components/motion/BlurWords";
import { useProgressTrigger } from "@/components/motion/ProgressTrigger";
import ProjectModal from "@/components/modal/ProjectModal";
import { categoryCounts, filterProjects, getProject, projects, sortProjects } from "@/lib/projects";
import { DOMAIN_LABELS } from "@/lib/wiki-meta";
import { useLikes } from "@/stores/likes";
import { useFilterStore } from "@/stores/filter";
import type { FilterKey, Project, SortMode } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import FilterTabs from "./FilterTabs";
import FilterSidebar from "./FilterSidebar";
import SortDropdown from "./SortDropdown";
import LazyMount from "./LazyMount";
import { recordRecentlyViewed } from "./RecentlyViewed";

const HEADING = "모든 지식을, 한 곳에";
const LAYER_PARAM = "layer";
const DOMAIN_PARAM = "domain";
const EAGER_COUNT = 8;

/** onChange 페이로드에서 진행도 숫자를 방어적으로 추출 (숫자·{raw|progress|value}·SpringValue 대응) */
function readProgress(payload: unknown): number {
  if (typeof payload === "number") return payload;
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of ["raw", "progress", "value"]) {
      const candidate = record[key];
      if (typeof candidate === "number") return candidate;
      if (candidate && typeof (candidate as { get?: unknown }).get === "function") {
        const value = (candidate as { get: () => unknown }).get();
        if (typeof value === "number") return value;
      }
    }
  }
  return 0;
}

function matchesQuery(project: Project, query: string): boolean {
  if (!query) return true;
  const haystack = [project.title, project.titleEn, project.description, ...project.keywords]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

interface CategoryGroup {
  key: string;
  label: string;
  items: Project[];
}

/** 카테고리별 섹션 헤더용 그룹핑 — "카드 한 덩어리" 대신 위키다운 단위 구분(사용자 반려 2026-07-16).
 *  이미 필터·검색·정렬이 끝난 리스트를 첫 등장 순서대로 묶는다(정렬 순서는 그룹 내에서 유지됨).
 *  단일 도메인 필터일 땐 카테고리명만, 전체/내 보드처럼 여러 도메인이 섞이면 "도메인 · 카테고리"로 구분. */
function groupByCategory(list: Project[], multiDomain: boolean): CategoryGroup[] {
  const groups = new Map<string, CategoryGroup>();
  for (const p of list) {
    const label = multiDomain ? `${DOMAIN_LABELS[p.category]} · ${p.categoryLabel}` : p.categoryLabel;
    const key = multiDomain ? `${p.category}::${p.categoryLabel}` : p.categoryLabel;
    let group = groups.get(key);
    if (!group) {
      group = { key, label, items: [] };
      groups.set(key, group);
    }
    group.items.push(p);
  }
  return [...groups.values()];
}

export default function ProjectsGrid() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const titleProgress = useMemo(() => new SpringValue(0), []);
  const titleStartedRef = useRef(false);
  const filter = useFilterStore((s) => s.filter);
  const setFilter = useFilterStore((s) => s.setFilter);
  const [sort, setSort] = useState<SortMode>("Popular");
  const [query, setQuery] = useState("");
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const hydrateLikes = useLikes((state) => state.hydrate);
  const liked = useLikes((state) => state.liked);

  useEffect(() => {
    hydrateLikes();
  }, [hydrateLikes]);

  // 헤더 캡슐 네비의 도메인 링크(?domain=)로 진입했을 때 초기 필터 반영
  useEffect(() => {
    const domain = new URL(window.location.href).searchParams.get(DOMAIN_PARAM);
    if (domain) setFilter(domain as FilterKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 섹션 진행도 top bottom → top center; raw > .02 시점에 타이틀 블러 리빌(duration 1100) 1회 발동
  useProgressTrigger({
    ref: sectionRef,
    start: "top bottom",
    end: "top center",
    onChange: (payload: unknown) => {
      if (titleStartedRef.current || readProgress(payload) <= 0.02) return;
      titleStartedRef.current = true;
      titleProgress.start(1, { config: { duration: 1100 } });
    },
  });

  const handleOpen = useCallback((project: Project) => {
    setOpenProject(project);
    window.history.pushState(null, "", `?${LAYER_PARAM}=${project.id}`);
    recordRecentlyViewed(project.id);
  }, []);

  const handleClose = useCallback(() => {
    setOpenProject(null);
    const url = new URL(window.location.href);
    url.searchParams.delete(LAYER_PARAM);
    window.history.replaceState(null, "", url.toString());
  }, []);

  const handleNavigate = useCallback(
    (id: string) => {
      const project = getProject(id);
      if (project) handleOpen(project);
    },
    [handleOpen],
  );

  // 초기 ?layer= 딥링크 즉시 오픈 + popstate 로 뒤로/앞으로 대응
  useEffect(() => {
    const readLayer = () => new URL(window.location.href).searchParams.get(LAYER_PARAM);
    const initialId = readLayer();
    if (initialId) {
      const project = getProject(initialId);
      if (project) setOpenProject(project);
    }
    const onPopState = () => {
      const id = readLayer();
      if (!id) {
        setOpenProject(null);
        return;
      }
      const project = getProject(id);
      if (project) setOpenProject(project);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const bookmarkedIds = useMemo(() => new Set(Object.keys(liked)), [liked]);
  const searched = useMemo(() => projects.filter((p) => matchesQuery(p, query)), [query]);
  const visible = useMemo(
    () => sortProjects(filterProjects(searched, filter, bookmarkedIds), sort, filter),
    [searched, filter, sort, bookmarkedIds],
  );
  const counts = useMemo(() => ({ ...categoryCounts(), bookmarked: bookmarkedIds.size }), [bookmarkedIds]);
  const multiDomain = filter === "all" || filter === "bookmarked";
  const groups = useMemo(() => groupByCategory(visible, multiDomain), [visible, multiDomain]);

  return (
    <section ref={sectionRef} id="projects" className="relative pb-28 pt-28">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <h2 className="section-title">
          {/* 원본: exit false·unrevealAt 1 — 리빌 후 소멸 없음 */}
          <BlurWords text={HEADING} progress={titleProgress} exit={false} unrevealAt={1} className="sm:whitespace-nowrap" />
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="search"
            className="subscribe-input"
            style={{ maxWidth: "16rem" }}
            placeholder="검색 (제목·키워드)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="항목 검색"
          />
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>
      <div className="filter-panel mb-7 lg:hidden" role="tablist" aria-label="Domain">
        <FilterTabs active={filter} counts={counts} onSelect={setFilter} />
      </div>
      <div className="flex flex-col gap-9 lg:flex-row lg:gap-16">
        <FilterSidebar active={filter} counts={counts} onSelect={setFilter} onOpenProject={handleOpen} />
        <div className="flex w-full min-w-0 flex-col gap-16">
          {visible.length === 0 && (
            <p className="py-16 text-center text-base text-ink-faint">해당하는 항목이 없습니다.</p>
          )}
          {(() => {
            let runningIndex = 0;
            return groups.map((group) => {
              const startIndex = runningIndex;
              runningIndex += group.items.length;
              return (
                <section key={group.key} aria-label={group.label} className="wiki-domain-group">
                  {/* 카테고리 섹션 헤더 — 헤어라인은 그룹 헤더 "상단"에 1개만(qnbang-design layout.md:
                      점·선·면 절제 — 헤더-그리드 사이 구분선 금지, 여백으로만 분리). */}
                  <div className="border-t border-line pt-4 mb-6 flex items-baseline justify-between gap-3">
                    <p className="wiki-group-title">{group.label}</p>
                    <span className="filter-count">{group.items.length}개</span>
                  </div>
                  <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {group.items.map((project, i) => {
                      const index = startIndex + i;
                      const eager = index < EAGER_COUNT;
                      return (
                        <li key={project.id} id={`card-${project.id}`} className="h-full">
                          <LazyMount eager={eager}>
                            <ProjectCard project={project} index={index} eager={eager} onOpen={() => handleOpen(project)} />
                          </LazyMount>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            });
          })()}
        </div>
      </div>
      <ProjectModal project={openProject} onClose={handleClose} onNavigate={handleNavigate} />
    </section>
  );
}
