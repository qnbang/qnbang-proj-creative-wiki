/** 원본 전역 모션 설정 (0ru9lekhq5wzu.js 실측) */
export const springsConfig = {
  mobileWidth: 768,
  disableOnMobile: {
    hover: true,
    inview: false,
    spring: false,
    springtrigger: false,
  },
} as const;

/** 원본에서 반복 사용되는 스프링 프리셋 (청크 실측값) */
export const SPRING = {
  heroText: { tension: 110, friction: 26 },
  headerFade: { tension: 130, friction: 21 },
  cardReveal: { tension: 130, friction: 24 },
  cardHover: { tension: 240, friction: 26 },
  buttonHover: { tension: 220, friction: 26 },
  modal: { tension: 280, friction: 30 },
  mobileMenu: { tension: 280, friction: 28 },
  dropdown: { tension: 320, friction: 28 },
  accordion: { tension: 230, friction: 28 },
  toast: { tension: 300, friction: 26 },
  loaderLeave: { tension: 220, friction: 30 },
  meshFade: { tension: 120, friction: 28 },
} as const;

export function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.innerWidth <= springsConfig.mobileWidth;
}
