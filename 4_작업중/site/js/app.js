// 크리에이티브 인덱스 — 통합 위키 앱 (바닐라 ES module)
// 데이터: data/*.json (공통 필드 + detail 도메인 원본)

const DOMAINS = {
  'aesthetics':        { ko: '미감', en: 'AESTHETICS', color: 'var(--c-aesthetics)', desc: '아름다움이 작동하는 원리 — 게슈탈트 지각에서 신경미학까지.' },
  'art-movement':      { ko: '양식', en: 'MOVEMENTS',  color: 'var(--c-art)',        desc: '미술·디자인 양식의 역사와 개념 사전 — 색·타이포·인물로 읽는다.' },
  'typography':        { ko: '타이포', en: 'TYPOGRAPHY', color: 'var(--c-typo)',     desc: '활자의 역사와 사람 — 양식·거장·파운드리, 그리고 한글.' },
  'creative-strategy': { ko: '전략', en: 'STRATEGY',   color: 'var(--c-strategy)',   desc: '카피·발상·설득의 법칙 — 이론적 근거와 신뢰도까지 함께.' },
};
const DOMAIN_ORDER = ['aesthetics', 'art-movement', 'typography', 'creative-strategy'];

// 타임라인용 연도 파싱: "1400–1600" / "1960s–현재" / "1950s–1975 / 웹 2014–"
const NOW = 2026;
const TL_MIN = 1380, TL_MAX = 2030;
function parseYears(period) {
  const nums = (String(period).match(/\d{3,4}/g) || []).map(Number);
  if (!nums.length) return null;
  const start = nums[0];
  let end = nums.length > 1 ? nums[1] : (/현재|now|–\s*$|-\s*$/.test(period) ? NOW : start + 25);
  if (end < start) end = NOW;
  return [start, Math.min(end, TL_MAX)];
}
const tlX = (y) => ((Math.max(TL_MIN, Math.min(TL_MAX, y)) - TL_MIN) / (TL_MAX - TL_MIN)) * 100;

const CRED = {
  established: { ko: '정설',     cls: 'cred-established', note: '학술 검증·재현됨' },
  consensus:   { ko: '통설',     cls: 'cred-consensus',  note: '널리 통용·맥락 의존' },
  disputed:    { ko: '논쟁',     cls: 'cred-disputed',   note: '근거 약함·비판 존재' },
  industry:    { ko: '업계정전', cls: 'cred-industry',   note: '거장의 실무 지혜·실무 표준' },
  personal:    { ko: '개인철학', cls: 'cred-personal',   note: '실무자 에세이·방법론' },
};

const MARK_KEY = 'ckw_marks_v1';
const $ = (s, r = document) => r.querySelector(s);
const view = $('#view');

let ALL = [];
let BY_ID = new Map();

// ── 유틸 ──
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const getMarks = () => { try { return JSON.parse(localStorage.getItem(MARK_KEY)) || []; } catch { return []; } };
const isMarked = (id) => getMarks().includes(id);
function toggleMark(id) {
  const m = getMarks(); const i = m.indexOf(id);
  if (i >= 0) m.splice(i, 1); else m.push(id);
  localStorage.setItem(MARK_KEY, JSON.stringify(m));
}
function toast(msg) {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast';
    t.style.cssText = 'position:fixed;left:50%;bottom:34px;transform:translateX(-50%);background:#222;color:#fff;padding:10px 18px;font-size:13px;z-index:200;opacity:0;transition:opacity .25s;pointer-events:none';
    document.body.appendChild(t); }
  t.textContent = msg; t.style.opacity = '1';
  clearTimeout(t._t); t._t = setTimeout(() => { t.style.opacity = '0'; }, 1400);
}

// ── 데이터 로드 ──
async function loadData() {
  const files = ['aesthetics', 'art-movement', 'typography', 'creative-strategy'];
  const sets = await Promise.all(files.map((f) =>
    fetch(`data/${f}.json`, { cache: 'no-store' }).then((r) => r.ok ? r.json() : []).catch(() => [])));
  ALL = sets.flat();
  ALL.forEach((it) => {
    if (!it.categoryLabel) it.categoryLabel = it.category || '';
    BY_ID.set(it.id, it);
    const d = it.detail || {};
    it._search = [it.title, it.titleEn, it.origin, it.field, it.categoryLabel, it.oneLiner,
      (it.keywords || []).join(' '), d.desc, d.why, d.rationale, d.typo, d.motifDesc,
      (d.traits || []).join(' '), (d.figures || []).join(' '), (d.apply || []).join(' ')]
      .filter(Boolean).join(' ').toLowerCase();
  });
}

// ── 컴포넌트 ──
function badge(cred) {
  const c = CRED[cred]; if (!c) return '';
  return `<span class="badge ${c.cls}" title="${c.note}"><i class="b-dot"></i>${c.ko}</span>`;
}
function cardThumb(item) {
  const d = item.detail || {};
  const dm = DOMAINS[item.domain];
  if (d.artworks && d.artworks[0]) return `<img src="${esc(d.artworks[0].src)}" alt="" loading="lazy" referrerpolicy="no-referrer">`;
  if (d.demo) return `<span class="ct-demo">${d.demo}</span>`;
  if (d.svg) return `<span class="ct-svg">${d.svg}</span>`;
  return `<span class="ct-ph" style="--phc:${dm.color}">${esc((item.title || '·').slice(0, 1))}</span>`;
}
function cardHTML(item) {
  const d = DOMAINS[item.domain]; const marked = isMarked(item.id);
  const sub = [item.origin, item.year || item.period].filter(Boolean).join(' · ');
  return `<a class="card" href="#/item/${item.id}">
    <span class="card-thumb">${cardThumb(item)}</span>
    <button class="card-star ${marked ? 'on' : ''}" data-mark="${item.id}" aria-label="북마크 토글">${marked ? '★' : '☆'}</button>
    <span class="card-body">
      <span class="card-top"><i class="card-dot" style="background:${d.color}"></i>${d.ko} · ${esc(item.categoryLabel)}</span>
      <span class="card-title">${esc(item.title)}${item.titleEn ? `<small>${esc(item.titleEn)}</small>` : ''}</span>
      <span class="card-oneliner">${esc(item.oneLiner)}</span>
      ${sub ? `<span class="card-meta">${esc(sub)}</span>` : ''}
    </span>
  </a>`;
}
const grid = (items) => items.length
  ? `<div class="card-grid">${items.map(cardHTML).join('')}</div>`
  : `<div class="empty">조건에 맞는 항목이 없습니다.</div>`;

// ── 뷰: 홈 ──
function renderHome() {
  const counts = DOMAIN_ORDER.map((k) => ALL.filter((x) => x.domain === k).length);
  const domainCards = DOMAIN_ORDER.map((k, i) => {
    const d = DOMAINS[k];
    return `<a class="domain-card" href="#/explore?d=${k}">
      <i class="dot" style="background:${d.color}"></i>
      <h3>${d.ko}</h3><div class="en">${d.en}</div>
      <p>${d.desc}</p><div class="count"><b>${counts[i]}</b> 항목</div>
    </a>`;
  }).join('');
  const featured = pickFeatured();
  view.innerHTML = `
    <section class="hero">
      <div class="hero-mark" aria-hidden="true"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="#222" stroke-width="2.5"/><circle cx="50" cy="50" r="40" fill="none" stroke="#222" stroke-width="2.5" transform="rotate(0 50 50)" stroke-dasharray="2 10"/><circle cx="50" cy="50" r="10" fill="#222"/></svg></div>
      <h1 class="hero-title">크리에이티브 인덱스</h1>
      <p class="hero-desc">아름다움의 원리, 미술·디자인 양식, 카피·발상의 법칙 —<br>흩어진 크리에이티브 지식을 하나의 색인으로. <b>${ALL.length}</b>개 항목.</p>
      <form class="hero-search" id="homeSearch"><input type="search" placeholder="무엇이든 검색 — 대비, 바우하우스, 프레이밍…" aria-label="검색"></form>
    </section>
    <div class="wrap">
      <section class="domains">${domainCards}</section>
      <section class="featured">
        <h2 class="section-head">오늘의 항목 <button class="shuffle-btn" id="shuffle">셔플</button></h2>
        <div class="featured-grid" id="featuredGrid">${featured.map(cardHTML).join('')}</div>
      </section>
    </div>`;
  $('#homeSearch').addEventListener('submit', (e) => {
    e.preventDefault();
    const q = e.target.querySelector('input').value.trim();
    location.hash = `#/explore${q ? `?q=${encodeURIComponent(q)}` : ''}`;
  });
  $('#shuffle').addEventListener('click', () => { $('#featuredGrid').innerHTML = pickFeatured().map(cardHTML).join(''); });
}
function pickFeatured() {
  return DOMAIN_ORDER.map((k) => {
    const pool = ALL.filter((x) => x.domain === k);
    return pool[Math.floor(Math.random() * pool.length)];
  }).filter(Boolean);
}

// ── 뷰: 탐색 ──
let exState = { d: 'all', c: 'all', q: '', view: 'grid' };
function renderExplore(params) {
  exState = { d: params.get('d') || 'all', c: params.get('c') || 'all', q: params.get('q') || '', view: params.get('v') || 'grid' };
  const domainChips = ['all', ...DOMAIN_ORDER].map((k) => {
    const n = k === 'all' ? ALL.length : ALL.filter((x) => x.domain === k).length;
    const label = k === 'all' ? '전체' : DOMAINS[k].ko;
    return `<button class="chip" data-domain="${k}" data-d="${k}">${label}<sup>${n}</sup></button>`;
  }).join('');
  view.innerHTML = `<div class="wrap">
    <div class="explore-head">
      <div class="search-row"><input type="search" id="exSearch" placeholder="제목·제창자·키워드·본문 검색…" value="${esc(exState.q)}" aria-label="검색"></div>
      <div class="chips" id="domainChips">${domainChips}</div>
      <div class="explore-tools">
        <div class="subchips" id="subChips"></div>
        <div class="view-toggle" id="viewToggle"></div>
      </div>
      <div class="result-meta" id="resultMeta"></div>
    </div>
    <div id="gridHolder"></div>
  </div>`;
  $('#exSearch').addEventListener('input', (e) => { exState.q = e.target.value; exState.c = 'all'; syncURL(); applyFilters(); });
  $('#domainChips').addEventListener('click', (e) => {
    const b = e.target.closest('[data-d]'); if (!b) return;
    exState.d = b.dataset.d; exState.c = 'all'; if (!TIMELINE_DOMAINS.includes(exState.d)) exState.view = 'grid';
    syncURL(); markDomainChip(); renderSubChips(); renderViewToggle(); applyFilters();
  });
  $('#viewToggle').addEventListener('click', (e) => {
    const b = e.target.closest('[data-v]'); if (!b) return;
    exState.view = b.dataset.v; syncURL(); renderViewToggle(); applyFilters();
  });
  markDomainChip(); renderSubChips(); renderViewToggle(); applyFilters();
}
function markDomainChip() {
  view.querySelectorAll('#domainChips .chip').forEach((c) => c.classList.toggle('active', c.dataset.d === exState.d));
}
function renderSubChips() {
  const holder = $('#subChips'); if (!holder) return;
  const pool = exState.d === 'all' ? ALL : ALL.filter((x) => x.domain === exState.d);
  const cats = [];
  pool.forEach((x) => { if (!cats.includes(x.categoryLabel)) cats.push(x.categoryLabel); });
  if (exState.d === 'all' || cats.length <= 1) { holder.innerHTML = ''; return; }
  holder.innerHTML = [`<button class="subchip ${exState.c === 'all' ? 'active' : ''}" data-c="all">전체</button>`,
    ...cats.map((c) => `<button class="subchip ${exState.c === c ? 'active' : ''}" data-c="${esc(c)}">${esc(c)}</button>`)].join('');
  holder.onclick = (e) => { const b = e.target.closest('[data-c]'); if (!b) return; exState.c = b.dataset.c; syncURL(); renderSubChips(); applyFilters(); };
}
const TIMELINE_DOMAINS = ['art-movement', 'typography'];
function renderViewToggle() {
  const el = $('#viewToggle'); if (!el) return;
  if (!TIMELINE_DOMAINS.includes(exState.d)) { el.innerHTML = ''; return; }
  el.innerHTML = [['grid', '그리드'], ['timeline', '타임라인']].map(([v, l]) =>
    `<button class="view-btn ${exState.view === v ? 'active' : ''}" data-v="${v}">${l}</button>`).join('');
}
function timelineHTML(items) {
  const list = items.map((it) => ({ it, yr: parseYears(it.period) })).filter((x) => x.yr).sort((a, b) => a.yr[0] - b.yr[0]);
  if (!list.length) return `<div class="empty">표시할 양식이 없습니다.</div>`;
  const isType = list[0].it.domain === 'typography';
  const decades = []; for (let y = 1400; y <= 2000; y += 100) decades.push(y);
  return `<div class="timeline${isType ? ' timeline-type' : ''}">
    <div class="tl-axis">${decades.map((y) => `<span class="tl-axis-label" style="left:${tlX(y)}%">${y}</span>`).join('')}<span class="tl-axis-label tl-now" style="left:100%">현재</span></div>
    <div class="tl-body">
      ${decades.map((y) => `<i class="tl-grid" style="left:${tlX(y)}%"></i>`).join('')}
      ${list.map(({ it, yr }) => {
        const f = it.detail && it.detail.fonts && it.detail.fonts[0];
        const sample = it.detail && it.detail.sampleText;
        // 활자 양식(sampleText+대표서체 보유)만 큰 글자로 — 인물·파운드리·한글은 막대 유지
        if (isType && sample && f && f.css) {
          const x = tlX(yr[0]);
          const tf = x > 66 ? 'translate(-100%,-50%)' : 'translate(0,-50%)';
          return `<a class="tl-row tl-row-type" href="#/item/${it.id}">
            <span class="tl-name">${esc(it.title)}<em>${esc(it.period)}</em></span>
            <span class="tl-track"><span class="tl-glyph" style="left:${x}%;transform:${tf};font-family:${f.css}">${esc(sample)}</span></span>
          </a>`;
        }
        const art = it.detail && it.detail.artworks && it.detail.artworks[0];
        const demo = it.detail && it.detail.demo;
        const thumb = art ? `<img src="${esc(art.src)}" alt="${esc(it.title)}" loading="lazy">`
          : demo ? `<div class="demo-thumb">${demo}</div>`
          : `<span class="tl-thumb-ph">${esc(it.title.slice(0, 1))}</span>`;
        const w = Math.max(2, tlX(yr[1]) - tlX(yr[0]));
        return `<a class="tl-row" href="#/item/${it.id}">
          <span class="tl-thumb">${thumb}</span>
          <span class="tl-name">${esc(it.title)}<em>${esc(it.period)}</em></span>
          <span class="tl-track"><i class="tl-bar" style="left:${tlX(yr[0])}%;width:${w}%"></i></span>
        </a>`;
      }).join('')}
    </div>
    <p class="tl-note">${isType ? '활자 양식 = 그 시대 대표 서체로 렌더 · 인물·회사·한글은 막대 · 시대순 · 가로 = 등장 시기' : '막대 = 시대 폭 · 썸네일 = 대표작'}</p>
  </div>`;
}
function applyFilters() {
  let items = ALL.slice();
  if (exState.d !== 'all') items = items.filter((x) => x.domain === exState.d);
  if (exState.c !== 'all') items = items.filter((x) => x.categoryLabel === exState.c);
  const q = exState.q.trim().toLowerCase();
  if (q) items = items.filter((x) => x._search.includes(q));
  const isTL = TIMELINE_DOMAINS.includes(exState.d) && exState.view === 'timeline';
  const meta = $('#resultMeta');
  const holder = $('#gridHolder'); if (!holder) return;
  if (isTL) {
    const tl = items.filter((x) => x.category !== 'concept');
    if (meta) meta.textContent = `${tl.length}개 양식 · 시대순${q ? ` · “${exState.q}”` : ''}`;
    holder.innerHTML = timelineHTML(tl);
  } else {
    if (meta) meta.textContent = `${items.length}개 항목${q ? ` · “${exState.q}”` : ''}`;
    holder.innerHTML = grid(items);
  }
}
function syncURL() {
  const p = new URLSearchParams();
  if (exState.d !== 'all') p.set('d', exState.d);
  if (exState.c !== 'all') p.set('c', exState.c);
  if (exState.q.trim()) p.set('q', exState.q.trim());
  if (exState.view && exState.view !== 'grid') p.set('v', exState.view);
  const qs = p.toString();
  history.replaceState(null, '', `#/explore${qs ? `?${qs}` : ''}`);
}

// ── 뷰: 상세 ──
function renderItem(id) {
  const it = BY_ID.get(id);
  if (!it) { view.innerHTML = `<div class="wrap"><div class="empty">항목을 찾을 수 없습니다. <a href="#/explore">탐색으로</a></div></div>`; return; }
  const d = DOMAINS[it.domain]; const det = it.detail || {};
  const marked = isMarked(it.id);
  const meta = [it.origin, it.year || it.period, it.field].filter(Boolean);

  let body = '';
  if (it.domain === 'aesthetics') {
    body = section('정의', det.desc)
      + (det.svg ? `<div class="detail-figure">${det.svg}</div>` : '')
      + figures(det.images)
      + section('왜 통하는가', det.why)
      + listBlock('적용', det.apply)
      + sourcesBlock(it.sources);
  } else if (it.domain === 'art-movement' && it.category === 'concept') {
    body = section('개념', det.desc)
      + sourcesBlock(it.sources);
  } else if (it.domain === 'art-movement' || it.domain === 'typography') {
    body = (det.demo ? `<div class="detail-block"><div class="detail-sub">스타일 예시</div><div class="demo-box">${det.demo}</div></div>` : '')
      + artworksBlock(det.artworks)
      + section('개요', det.desc)
      + tagBlock('특징', det.traits)
      + paletteBlock(det.palette)
      + (det.typo ? section('타이포그래피', det.typo) : '') + fontsBlock(det.fonts)
      + (det.motifDesc ? section('모티프', det.motifDesc) : '') + tagBlock('', det.motifs)
      + figuresBlock(det.figures, det.figurePortraits)
      + (it.domain === 'typography' ? fontLinksBlock(it) : galleryBlock(det.gallery, it))
      + sourcesBlock(it.sources);
  } else if (it.domain === 'creative-strategy') {
    body = section('설명', det.desc)
      + section('이론적 근거', det.rationale)
      + listBlock('적용', det.apply)
      + examplesBlock(det.examples)
      + sourcesBlock(it.sources);
  }

  const rel = (it.related || []).map((rid) => BY_ID.get(rid)).filter(Boolean);
  view.innerHTML = `<div class="wrap"><article class="detail">
    <a class="detail-back" href="#/explore?d=${it.domain}">← ${d.ko} 목록</a>
    <div class="detail-top"><i class="card-dot" style="background:${d.color}"></i>${d.ko} · ${esc(it.categoryLabel)} ${badge(it.credibility)}</div>
    <h1 class="detail-title">${esc(it.title)}${it.titleEn ? `<span class="en">${esc(it.titleEn)}</span>` : ''}</h1>
    ${meta.length ? `<div class="detail-source">${meta.map((m) => `<span>${esc(m)}</span>`).join('')}</div>` : ''}
    <p class="detail-oneliner">${esc(it.oneLiner)}</p>
    <div class="detail-actions">
      <button class="btn ${marked ? 'on' : ''}" data-mark="${it.id}">${marked ? '★ 저장됨' : '☆ 북마크'}</button>
    </div>
    <div class="detail-body">${body}</div>
    ${rel.length ? `<div class="detail-block" style="margin-top:40px"><div class="detail-sub">연결된 항목</div><div class="related-grid">${rel.map(cardHTML).join('')}</div></div>` : ''}
  </article></div>`;

  // 양식 서체 동적 로드 (프리뷰가 실제 폰트로 보이도록)
  if (it.domain === 'art-movement' && det.fonts && det.fonts.length) {
    ensureFontLink(det.fonts.map((f) => (f.name || '').trim().replace(/ /g, '+')).filter(Boolean).join('&family='));
  }
  // 팔레트 색 복사
  view.querySelectorAll('.swatch').forEach((sw) => sw.addEventListener('click', () => {
    const hex = sw.dataset.hex; navigator.clipboard?.writeText(hex); toast(`${hex} 복사됨`);
  }));
}
const section = (label, text) => text ? `<div class="detail-block"><div class="detail-sub">${esc(label)}</div><p>${esc(text)}</p></div>` : '';
const listBlock = (label, arr) => (arr && arr.length) ? `<div class="detail-block"><div class="detail-sub">${esc(label)}</div><ul class="detail-list">${arr.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : '';
const tagBlock = (label, arr) => (arr && arr.length) ? `<div class="detail-block">${label ? `<div class="detail-sub">${esc(label)}</div>` : ''}<div class="chips-inline">${arr.map((x) => `<span class="tag">${esc(x)}</span>`).join('')}</div></div>` : '';
function paletteBlock(pal) {
  if (!pal || !pal.length) return '';
  return `<div class="detail-block"><div class="detail-sub">팔레트</div><div class="palette">${pal.map((p) => `<span class="swatch" data-hex="${esc(p.hex)}"><i style="background:${esc(p.hex)}"></i><span>${esc(p.name || '')}</span><b>${esc(p.hex)}</b></span>`).join('')}</div></div>`;
}
function fontsBlock(fonts) {
  if (!fonts || !fonts.length) return '';
  return `<div class="detail-block"><div class="detail-sub">서체</div>${fonts.map((f) => {
    const g = `https://fonts.google.com/specimen/${(f.name || '').trim().replace(/ /g, '+')}`;
    return `<div class="fontrow"><div class="fp" style="font-family:${f.css || 'inherit'}">${esc(f.name)}</div><div class="fn">${esc(f.note || '')}${f.name ? ` · <a href="${g}" target="_blank" rel="noopener">Google Fonts에서 받기 ↗</a>` : ''}</div></div>`;
  }).join('')}</div>`;
}
function ensureFontLink(families) {
  if (!families) return;
  try { if (document.querySelector(`link[data-font="${CSS.escape(families)}"]`)) return; } catch { /* noop */ }
  const l = document.createElement('link'); l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  l.dataset.font = families;
  document.head.appendChild(l);
}
function figures(imgs) {
  if (!imgs || !imgs.length) return '';
  return imgs.map((im) => `<div class="detail-figure"><img src="${esc(im.src)}" alt="${esc(im.caption || '')}" loading="lazy"></div>`).join('');
}
function sourcesBlock(sources) {
  if (!sources || !sources.length) return '';
  return `<div class="detail-block"><div class="detail-sub">출처</div><ul class="sources">${sources.map((s) => `<li>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label || s.url)} ↗</a>` : esc(s.label)}</li>`).join('')}</ul></div>`;
}
function artworksBlock(arts) {
  if (!arts || !arts.length) return '';
  return `<div class="detail-block"><div class="detail-sub">대표작</div>
    <div class="artwork-grid">${arts.map((a) => `
      <figure class="artwork" data-zoom="${esc(a.src)}" data-cap="${esc([a.title, a.artist, a.year].filter(Boolean).join(' · '))}">
        <img src="${esc(a.src)}" alt="${esc(a.title)}" loading="lazy" referrerpolicy="no-referrer">
        <figcaption><b>${esc(a.title)}</b>${a.titleEn ? `<i>${esc(a.titleEn)}</i>` : ''}<span>${esc([a.artist, a.year].filter(Boolean).join(', '))}</span></figcaption>
      </figure>`).join('')}</div></div>`;
}
function figuresBlock(figures, portraits) {
  if (!figures || !figures.length) return '';
  portraits = portraits || {};
  return `<div class="detail-block"><div class="detail-sub">대표 인물</div>
    <div class="figure-grid">${figures.map((name) => {
      const p = portraits[name];
      return `<div class="figure">${p
        ? `<span class="figure-thumb" data-zoom="${esc(p)}" data-cap="${esc(name)}"><img src="${esc(p)}" alt="${esc(name)}" loading="lazy" referrerpolicy="no-referrer"></span>`
        : `<span class="figure-thumb figure-ph">${esc(name.slice(0, 1))}</span>`}<span class="figure-name">${esc(name)}</span></div>`;
    }).join('')}</div></div>`;
}
function examplesBlock(ex) {
  if (!ex) return '';
  const grp = (label, arr) => (arr && arr.length)
    ? `<div class="ex-group"><div class="ex-region">${label}</div>${arr.map((e) => `<figure class="ex-copy"><blockquote>“${esc(e.copy)}”</blockquote><figcaption>${esc(e.brand || '')}${e.year ? ` · ${esc(e.year)}` : ''}${e.note ? `<span class="ex-note">${esc(e.note)}</span>` : ''}</figcaption></figure>`).join('')}</div>`
    : '';
  const ko = grp('국내', ex.ko); const en = grp('해외', ex.en);
  if (!ko && !en) return '';
  return `<div class="detail-block"><div class="detail-sub">실제 카피 예시</div><div class="ex-wrap">${ko}${en}</div></div>`;
}
function fontLinksBlock(item) {
  const d = item.detail || {};
  const isKorean = item.category === '한글 타이포그래피';
  const clean = (s) => String(s).replace(/\s*\(.*?\)\s*/g, '').replace(/[，,].*$/, '').trim();
  const names = [...(d.fonts || []).map((f) => f.name), ...(d.realTypefaces || [])].map(clean).filter(Boolean);
  const uniqNames = [...new Set(names)].slice(0, 8);
  const rows = uniqNames.map((n) => {
    const q = encodeURIComponent(n);
    return `<li><span class="fl-name">${esc(n)}</span><span class="fl-links">`
      + `<a href="https://fonts.google.com/?query=${q}" target="_blank" rel="noopener">Google</a>`
      + `<a href="https://fonts.adobe.com/search?query=${q}" target="_blank" rel="noopener">Adobe</a>`
      + (isKorean ? `<a href="https://noonnu.cc/index?keyword=${q}" target="_blank" rel="noopener">눈누</a>` : '')
      + `</span></li>`;
  }).join('');
  const browse = encodeURIComponent(item.titleEn || item.title);
  const platforms = [
    `<a href="https://fonts.google.com/?query=${browse}" target="_blank" rel="noopener">Google Fonts ↗</a>`,
    `<a href="https://fonts.adobe.com/search?query=${browse}" target="_blank" rel="noopener">Adobe Fonts ↗</a>`,
    `<a href="https://noonnu.cc/index" target="_blank" rel="noopener">눈누(무료 한글폰트) ↗</a>`,
  ];
  return `<div class="detail-block"><div class="detail-sub">관련 서체 · 받기</div>
    ${uniqNames.length ? `<ul class="fontlist">${rows}</ul>` : ''}
    <div class="mood-links">${platforms.join('')}</div>
  </div>`;
}
function galleryBlock(g, it) {
  const links = `<div class="mood-links">
    ${g && g.q ? `<a href="https://www.pinterest.com/search/pins/?q=${encodeURIComponent(g.q)}" target="_blank" rel="noopener">Pinterest에서 더 보기 ↗</a>` : ''}
    <a href="https://artvee.com/?s=${encodeURIComponent(it.titleEn || it.title)}" target="_blank" rel="noopener">Artvee에서 보기 ↗</a>
  </div>`;
  if (!g || !g.images || !g.images.length) return `<div class="detail-block"><div class="detail-sub">더 보기</div>${links}</div>`;
  return `<div class="detail-block"><div class="detail-sub">분위기 더 보기 <span class="muted-note">영감용 · 시대 분류 미검증</span></div>
    <div class="mood-grid">${g.images.slice(0, 9).map((src) => `<button class="mood-thumb" data-zoom="${esc(src)}" aria-label="확대"><img src="${esc(src)}" alt="" loading="lazy" referrerpolicy="no-referrer"></button>`).join('')}</div>
    ${links}</div>`;
}
function openLightbox(src, cap) {
  let lb = $('#lightbox');
  if (!lb) {
    lb = document.createElement('div'); lb.id = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="닫기">✕</button><img alt=""><figcaption></figcaption>';
    document.body.appendChild(lb);
    lb.addEventListener('click', (ev) => { if (ev.target === lb || ev.target.classList.contains('lb-close')) lb.classList.remove('open'); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') lb.classList.remove('open'); });
  }
  lb.querySelector('img').src = src;
  const fc = lb.querySelector('figcaption'); fc.textContent = cap || ''; fc.style.display = cap ? '' : 'none';
  lb.classList.add('open');
}

// ── 뷰: 보드 ──
function renderBoard() {
  const items = getMarks().map((id) => BY_ID.get(id)).filter(Boolean);
  view.innerHTML = `<div class="wrap">
    <div class="explore-head"><h2 class="section-head" style="padding-top:8px">내 보드 <span class="muted">${items.length}개 저장됨</span></h2></div>
    ${items.length ? grid(items) : `<div class="board-empty">아직 저장한 항목이 없습니다.<br>카드의 ☆를 눌러 마음에 든 법칙·양식을 모아보세요. <a href="#/explore">탐색하러 가기</a></div>`}
  </div>`;
}

// ── 뷰: 소개 ──
function renderAbout() {
  const legend = Object.values(CRED).map((c) => `<span class="badge ${c.cls}"><i class="b-dot"></i>${c.ko} — ${c.note}</span>`).join('');
  view.innerHTML = `<div class="wrap"><div class="about">
    <h2>소개</h2>
    <p>〈크리에이티브 인덱스〉는 흩어져 있던 세 갈래의 크리에이티브 지식을 하나의 색인으로 모읍니다 — <b>미감</b>(아름다움의 원리), <b>양식</b>(미술·디자인 사조와 개념), <b>전략</b>(카피·발상·설득의 법칙).</p>
    <p>각 항목은 한 줄 정의 — 설명 — 근거 — 적용의 순서로 정리되며, 가능한 한 출처를 명시합니다.</p>
    <p><b>신뢰도 배지</b>는 "이론적으로 얼마나 단단한가"를 표시합니다. 거장의 직관과 실험으로 검증된 정설을 구분하기 위한 장치입니다.</p>
    <div class="legend">${legend}</div>
    <p class="muted" style="font-size:13px">데이터: 미감의 법칙(117) · 디자인 양식 FORMA(양식 34 + 개념 45) · 크리에이티브 전략(작성 중). 예시 도판은 퍼블릭 도메인 및 자체 제작.</p>
  </div></div>`;
}

// ── 라우터 ──
function router() {
  const lb = $('#lightbox'); if (lb) lb.classList.remove('open');
  const raw = location.hash.slice(1) || '/';
  const [path, query] = raw.split('?');
  const params = new URLSearchParams(query || '');
  const seg = path.split('/').filter(Boolean); // ['item','id'] 등

  if (seg[0] === 'explore') renderExplore(params);
  else if (seg[0] === 'item' && seg[1]) renderItem(decodeURIComponent(seg[1]));
  else if (seg[0] === 'board') renderBoard();
  else if (seg[0] === 'about') renderAbout();
  else renderHome();

  // nav active
  document.querySelectorAll('.nav-link[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === seg[0]));
  updateBoardCount();
  if (seg[0] !== 'explore') window.scrollTo(0, 0);
  view.focus({ preventScroll: true });
}
function updateBoardCount() {
  const n = getMarks().length; const el = $('#navBoardCount'); if (el) el.textContent = n ? n : '';
}

// 북마크 토글 (위임)
view.addEventListener('click', (e) => {
  const zoom = e.target.closest('[data-zoom]');
  if (zoom) { e.preventDefault(); openLightbox(zoom.dataset.zoom, zoom.dataset.cap); return; }
  const mk = e.target.closest('[data-mark]');
  if (!mk) return;
  e.preventDefault(); e.stopPropagation();
  toggleMark(mk.dataset.mark);
  const seg = (location.hash.slice(1) || '/').split('?')[0].split('/').filter(Boolean);
  if (seg[0] === 'board') renderBoard();
  else router._refreshStars ? router._refreshStars() : refreshStars();
  updateBoardCount();
});
function refreshStars() {
  view.querySelectorAll('[data-mark]').forEach((b) => {
    const on = isMarked(b.dataset.mark);
    if (b.classList.contains('card-star')) { b.classList.toggle('on', on); b.textContent = on ? '★' : '☆'; }
    else if (b.classList.contains('btn')) { b.classList.toggle('on', on); b.textContent = on ? '★ 저장됨' : '☆ 북마크'; }
  });
}

// ── 시작 ──
(async function init() {
  view.innerHTML = `<div class="wrap"><div class="empty">불러오는 중…</div></div>`;
  await loadData();
  window.addEventListener('hashchange', router);
  router();
})();
