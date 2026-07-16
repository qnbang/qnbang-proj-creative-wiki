"use client";
// 유래: 098-la-ts0ea1.js 모듈 75893 ew(ProjectCard) 이식 — Spring 리빌 {130,24} y42 재사용.
//
// 위키 v2 "교과서 도판" 프로토타입(2026-07-16, 사용자 반려로 갤러리 crop 카드 폐기):
// 카드 상자·보더·태그 필을 걷어내고 도판(원래 판형 그대로, crop·레터박스 없음) + 캡션(제목·titleEn·
// 한줄정의)만 남긴다. 위계는 색·박스가 아니라 여백과 타이포로 만든다("AI슬롭 0" 지시).
// 호버는 기존 --lift 스프링(Hover, SPRING.cardHover)을 그대로 재사용해 도판 밝기+스케일을 주고,
// 제목 색·화살표는 CSS 트랜지션(200ms)으로 처리한다. 커서 추적 글로우(BorderGlow)는 군더더기로 판정돼 제거.

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import Spring from "@/components/motion/Spring";
import Hover from "@/components/motion/Hover";
import { SPRING } from "@/lib/springs";
import { likesDisplay, useLikes } from "@/stores/likes";
import type { Project } from "@/lib/types";
import WikiMedia from "./WikiMedia";
import CredibilityBadge from "./CredibilityBadge";
import { BookmarkIcon } from "./Icons";

const REVEAL_FROM = { opacity: 0, y: 42 };
const REVEAL_TO = { opacity: 1, y: 0 };
const LIFT_FROM = { "--lift": 0 };
const LIFT_TO = { "--lift": 1 };

interface ProjectCardProps {
  project: Project;
  index: number;
  eager: boolean;
  onOpen: () => void;
}

export default function ProjectCard({ project, index, eager, onOpen }: ProjectCardProps) {
  const liked = useLikes((state) => state.liked);
  const toggle = useLikes((state) => state.toggle);
  const isLiked = !!liked[project.id];

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <Spring
      tag="div"
      mode="once"
      from={REVEAL_FROM}
      to={REVEAL_TO}
      config={SPRING.cardReveal}
      delayIn={eager ? 55 * index : 60}
      className="grid-card-reveal h-full"
    >
      {/* Hover가 인터랙션 props를 받지 않아 클릭·키보드는 얇은 래퍼 div가 담당 (--lift는 article에 유지) */}
      <div
        className="h-full"
        role="button"
        tabIndex={0}
        aria-label={`Open ${project.title}`}
        onClick={onOpen}
        onKeyDown={handleKeyDown}
      >
        <Hover tag="article" className="wiki-figure h-full" from={LIFT_FROM} to={LIFT_TO} config={SPRING.cardHover}>
          <div className="wiki-figure-media">
            <WikiMedia project={project} variant="natural" />
            <button
              type="button"
              className={`wiki-figure-bookmark likes-pill ${isLiked ? "likes-pill-on" : ""}`}
              onClick={(event) => {
                event.stopPropagation();
                toggle(project.id);
              }}
              aria-label="내 보드에 저장"
            >
              {likesDisplay(project.likes, isLiked)}
              <BookmarkIcon filled={isLiked} />
            </button>
          </div>
          <div className="wiki-figure-caption">
            <div className="wiki-figure-titlerow">
              <span className="wiki-figure-title-wrap">
                <h3 className="wiki-figure-title">{project.title}</h3>
                <span className="wiki-figure-arrow" aria-hidden="true">
                  ↗
                </span>
              </span>
              <CredibilityBadge credibility={project.credibility} />
            </div>
            {project.titleEn && project.titleEn !== project.title && (
              <p className="wiki-figure-titleEn">{project.titleEn}</p>
            )}
            <p className="wiki-figure-oneliner">{project.description}</p>
          </div>
        </Hover>
      </div>
    </Spring>
  );
}
