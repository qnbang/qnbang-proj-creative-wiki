// ───────────────────────────────────────────────────────────────────────────
// Liquid Glass — vendored core (SVG feDisplacementMap distortion)
// Source: https://github.com/shuding/liquid-glass (liquid-glass.js @ main,
//   commit dated 2025-06-11). License: MIT, Copyright (c) 2025 Shu Ding.
// Vendored: 2026-07-16.
//
// Full upstream file audited before vendoring (292 lines, single file): only
// DOM/SVG/Canvas/Proxy APIs and a console.log. No fetch/XHR/WebSocket, no
// eval/Function-from-string, no analytics/tracking, no external URLs beyond
// the SVG's own data: URI (generated locally from canvas.toDataURL()). Safe
// to embed as-is.
//
// Adapted for 크리에이티브 인덱스 위키 nav 캡슐 (2026-07-16):
//   - Removed the upstream demo bootstrap: the draggable fixed-position
//     floating pill, its mousedown/mousemove drag handlers, the
//     window.liquidGlass global, and the console.log lines.
//   - Kept the core untouched: smoothStep/length/roundedRectSDF/texture
//     helpers and the per-pixel canvas → feImage → feDisplacementMap
//     pipeline that generates the lens-warp displacement map.
//   - Re-targeted the effect at an existing in-flow element (the header's
//     .nav-pill capsule) instead of a synthetic overlay: the SVG filter is
//     appended once (hidden) and the target element's own backdrop-filter
//     gets `url(#filter)` prepended, so the CSS-defined blur/saturate/
//     brightness recipe is preserved and only the distortion is added.
//   - Added: browser gating (see below) and resize-driven regeneration,
//     neither of which exist upstream (upstream is a fixed 300×200 demo).
// ───────────────────────────────────────────────────────────────────────────

// ── 원본 그대로: SDF·보간 유틸 ──
function smoothStep(a, b, t) {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function length(x, y) {
  return Math.sqrt(x * x + y * y);
}
function roundedRectSDF(x, y, width, height, radius) {
  const qx = Math.abs(x) - width + radius;
  const qy = Math.abs(y) - height + radius;
  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius;
}
function texture(x, y) {
  return { type: 't', x, y };
}

let uid = 0;
function generateId() {
  return `liquid-glass-${uid++}-${Math.random().toString(36).slice(2, 7)}`;
}

// 원본 데모의 fragment 셰이더(알약형 렌즈 굴절)를 그대로 사용 — uv는 -0.5..0.5 정규화 좌표라
// 실제 픽셀 종횡비와 무관하게 스타디움(완전 둥근 캡슐) 형태로 수렴한다(네비 캡슐과 형태 일치).
function fragment(uv) {
  const ix = uv.x - 0.5;
  const iy = uv.y - 0.5;
  const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
  const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
  const scaled = smoothStep(0, 1, displacement);
  return texture(ix * scaled + 0.5, iy * scaled + 0.5);
}

// SVG feImage/feDisplacementMap 필터 하나를 관리한다. 원본 Shader 클래스에서 드래그·이벤트
// 리스너·가시 컨테이너를 걷어내고, 치수만 바뀌면 update()로 in-place 재계산한다(id 유지).
class DisplacementFilter {
  constructor(width, height) {
    this.canvasDPI = 1;
    this.id = generateId();
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '0');
    this.svg.setAttribute('height', '0');
    this.svg.style.cssText = 'position:fixed; top:0; left:0; pointer-events:none; z-index:-1;';

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('filterUnits', 'userSpaceOnUse');
    filter.setAttribute('colorInterpolationFilters', 'sRGB');
    filter.setAttribute('x', '0');
    filter.setAttribute('y', '0');
    this.filter = filter;

    this.feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage');
    this.feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap');
    this.feDisplacementMap.setAttribute('in', 'SourceGraphic');
    this.feDisplacementMap.setAttribute('xChannelSelector', 'R');
    this.feDisplacementMap.setAttribute('yChannelSelector', 'G');

    filter.setAttribute('id', `${this.id}_filter`);
    this.feImage.setAttribute('id', `${this.id}_map`);
    this.feDisplacementMap.setAttribute('in2', `${this.id}_map`);

    filter.appendChild(this.feImage);
    filter.appendChild(this.feDisplacementMap);
    defs.appendChild(filter);
    this.svg.appendChild(defs);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    document.body.appendChild(this.svg);
    this.update(width, height);
  }

  get filterUrl() {
    return `url(#${this.id}_filter)`;
  }

  update(width, height) {
    this.width = width;
    this.height = height;
    this.filter.setAttribute('width', String(width));
    this.filter.setAttribute('height', String(height));
    this.feImage.setAttribute('width', String(width));
    this.feImage.setAttribute('height', String(height));

    const w = Math.max(1, Math.round(width * this.canvasDPI));
    const h = Math.max(1, Math.round(height * this.canvasDPI));
    this.canvas.width = w;
    this.canvas.height = h;
    const data = new Uint8ClampedArray(w * h * 4);

    let maxScale = 0;
    const rawValues = [];
    for (let i = 0; i < data.length; i += 4) {
      const x = (i / 4) % w;
      const y = Math.floor(i / 4 / w);
      const pos = fragment({ x: x / w, y: y / h });
      const dx = pos.x * w - x;
      const dy = pos.y * h - y;
      maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
      rawValues.push(dx, dy);
    }
    maxScale *= 0.5;

    let idx = 0;
    for (let i = 0; i < data.length; i += 4) {
      const r = rawValues[idx++] / maxScale + 0.5;
      const g = rawValues[idx++] / maxScale + 0.5;
      data[i] = r * 255;
      data[i + 1] = g * 255;
      data[i + 2] = 0;
      data[i + 3] = 255;
    }

    this.context.putImageData(new ImageData(data, w, h), 0, 0);
    this.feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', this.canvas.toDataURL());
    this.feDisplacementMap.setAttribute('scale', String(maxScale / this.canvasDPI));
  }

  destroy() {
    this.svg.remove();
    this.canvas.remove();
  }
}

// Safari·Firefox는 backdrop-filter 안의 SVG 필터(feImage/feDisplacementMap)를 지원하지 않는다
// (WebKit https://bugs.webkit.org/show_bug.cgi?id=245510,
//  Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1787623) — 값 자체는 무시되고 조용히
// 실패하므로(에러 없음) 신뢰할 수 있는 CSS.supports 기반 기능감지가 없다. 알려진 두 버그를
// 근거로 UA 분기하고, 그 외(Chromium 계열)에서만 굴절을 적용한다. 미해당 브라우저는 기존
// CSS의 blur 유리로 자동 폴백(아무 것도 하지 않음 = 폴백).
function browserSupportsSVGBackdropFilter() {
  const ua = navigator.userAgent;
  if (/Firefox\//.test(ua)) return false;
  const isSafari = /AppleWebKit/.test(ua) && /Version\//.test(ua) && !/Chrome|CriOS|Chromium|Edg/.test(ua);
  if (isSafari) return false;
  return true;
}

/**
 * 대상 엘리먼트(네비 캡슐)의 기존 backdrop-filter(블러·채도·밝기)는 그대로 두고, 앞에
 * `url(#filter)` 굴절만 겹쳐 씌운다. 리사이즈 시 치수 재계산, prefers-reduced-motion과
 * 미지원 브라우저는 조기 반환으로 기존 CSS 블러 유리 폴백을 그대로 둔다.
 * @param {HTMLElement} el
 */
export function applyLiquidGlass(el) {
  if (!el) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!browserSupportsSVGBackdropFilter()) return;
  if (!('backdropFilter' in document.documentElement.style) &&
      !('webkitBackdropFilter' in document.documentElement.style)) return;

  let dfilter = null;
  let resizeTimer = null;
  // CSS가 정의한 원래 backdrop-filter(blur·saturate·brightness)는 최초 1회만 읽어 고정한다.
  // rebuild()가 이미 url(#filter) ...를 인라인으로 씌운 뒤이므로, 리사이즈 때마다 다시
  // getComputedStyle을 읽으면 이전에 씌운 url(#filter)까지 함께 읽혀 계속 중첩돼버린다.
  const baseFilter = (() => {
    const cs = getComputedStyle(el);
    if (cs.backdropFilter && cs.backdropFilter !== 'none') return cs.backdropFilter;
    if (cs.webkitBackdropFilter && cs.webkitBackdropFilter !== 'none') return cs.webkitBackdropFilter;
    return '';
  })();

  function rebuild() {
    const r = el.getBoundingClientRect();
    const w = Math.round(r.width);
    const h = Math.round(r.height);
    if (!w || !h) return;
    if (dfilter) { dfilter.update(w, h); }
    else { dfilter = new DisplacementFilter(w, h); }
    const combined = `${dfilter.filterUrl} ${baseFilter}`.trim();
    el.style.setProperty('backdrop-filter', combined);
    el.style.setProperty('-webkit-backdrop-filter', combined);
  }

  rebuild();

  const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuild, 120);
  }) : null;
  if (ro) ro.observe(el);
  else window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(rebuild, 120);
  });
}
