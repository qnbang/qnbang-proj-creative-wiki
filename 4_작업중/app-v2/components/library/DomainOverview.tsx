"use client";
// 위키 v2 신규 — 히어로 아래, 탐색 그리드 위에 두는 "목차" 섹션(사용자 반려 2026-07-16:
// "위키 같은 구분감이 전혀 없다"). 도메인 5개를 세로로 나열해 "여기 5개 영역이 있다"가
// 3초에 읽히게 한다: 도메인명(섹션 타이틀 문법 재사용)+한 줄 소개+개수+대표 카드 4개+전체 보기.
// 카드 클릭은 ProjectsGrid의 기존 ?layer= 딥링크 메커니즘을 synthetic popstate로 재사용해
// 모달 상태를 새로 만들지 않는다(같은 페이지 안 유일한 모달 인스턴스는 ProjectsGrid가 소유).

import { projects } from "@/lib/projects";
import { DOMAIN_BLURBS, DOMAIN_LABELS, DOMAIN_ORDER } from "@/lib/wiki-meta";
import { useFilterStore } from "@/stores/filter";
import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import { recordRecentlyViewed } from "./RecentlyViewed";

const REP_COUNT = 4;

function openItem(project: Project) {
  window.history.pushState(null, "", `?layer=${project.id}`);
  window.dispatchEvent(new PopStateEvent("popstate"));
  recordRecentlyViewed(project.id);
}

export default function DomainOverview() {
  const setFilter = useFilterStore((s) => s.setFilter);

  const goToDomain = (domain: (typeof DOMAIN_ORDER)[number]) => {
    setFilter(domain);
    requestAnimationFrame(() => {
      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <section className="relative w-full pt-8" aria-label="도메인 목차">
      {/* qnbang-design layout.md: 도메인(대)섹션 사이 96px(section 토큰) */}
      <div className="flex flex-col gap-24">
        {DOMAIN_ORDER.map((domain) => {
          const items = projects.filter((p) => p.category === domain);
          const sample = items.slice(0, REP_COUNT);
          return (
            <div key={domain}>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  {/* qnbang-design typography.md 페이지 타이틀 32~40/700, 자간 -2%, keep-all —
                      원본 getlayers .section-title(48px/300, 히어로·탐색그리드 H2 전용)는 그대로 두고
                      이 도메인명 헤딩만 인라인으로 별도 스케일 지정 */}
                  <h3
                    style={{
                      fontFamily: "var(--font-general), system-ui, sans-serif",
                      fontSize: "2rem",
                      fontWeight: 700,
                      lineHeight: 1.35,
                      letterSpacing: "-.02em",
                      wordBreak: "keep-all",
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {DOMAIN_LABELS[domain]}
                  </h3>
                  <p className="mt-2 max-w-xl text-base text-ink-faint">{DOMAIN_BLURBS[domain]}</p>
                </div>
                <button
                  type="button"
                  className="nav-link px-0 py-0 shrink-0"
                  onClick={() => goToDomain(domain)}
                >
                  {items.length}개 전체 보기 <span aria-hidden="true">→</span>
                </button>
              </div>
              <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
                {sample.map((project, index) => (
                  <li key={project.id} className="h-full">
                    <ProjectCard project={project} index={index} eager onOpen={() => openItem(project)} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
