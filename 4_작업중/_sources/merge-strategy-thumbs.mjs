// strategy-thumbs.json(id → svg) → site/data/creative-strategy.json 각 항목 detail.svg 병합
// svg 외 필드 불변. 재실행 가능: node merge-strategy-thumbs.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBS_SRC = path.resolve(__dirname, 'strategy-thumbs.json');
const DATA = path.resolve(__dirname, '../site/data/creative-strategy.json');

const thumbs = JSON.parse(readFileSync(THUMBS_SRC, 'utf-8'));
const items = JSON.parse(readFileSync(DATA, 'utf-8'));

let merged = 0;
const missing = [];
items.forEach((it) => {
  if (thumbs[it.id]) {
    it.detail = it.detail || {};
    it.detail.svg = thumbs[it.id];
    merged += 1;
  } else {
    missing.push(it.id);
  }
});

const orphan = Object.keys(thumbs).filter((k) => !items.some((it) => it.id === k));

writeFileSync(DATA, JSON.stringify(items, null, 2), 'utf-8');

console.log(`항목 수: ${items.length}`);
console.log(`svg 병합: ${merged}`);
if (missing.length) console.log(`썸네일 없는 항목: ${missing.join(', ')}`);
if (orphan.length) console.log(`데이터에 없는 썸네일 id: ${orphan.join(', ')}`);
