#!/usr/bin/env node
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import https from 'https';

const SPEC_URL = 'https://api.hangkan-jeulkeun.goorm.training/api/docs/json';
const OUTPUT_SPEC = 'openapi.json';
const OUTPUT_TYPES = 'src/types/api.ts';

async function fetchSpecHtml() {
  return new Promise((resolve, reject) => {
    // SSL 인증서 문제(3단계 서브도메인) 우회 — 내부 개발 서버 전용
    const req = https.get(SPEC_URL, { rejectUnauthorized: false }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
  });
}

function extractSpec(html) {
  const idx = html.indexOf('"openapi":');
  if (idx === -1) throw new Error('OpenAPI spec을 찾을 수 없습니다.');

  let start = idx;
  while (html[start] !== '{') start--;

  let depth = 0,
    i = start,
    inStr = false,
    esc = false;
  for (; i < html.length; i++) {
    const c = html[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (!inStr) {
      if (c === '{') depth++;
      if (c === '}') { depth--; if (depth === 0) { i++; break; } }
    }
  }
  return JSON.parse(html.slice(start, i));
}

let spec;
try {
  console.log('📡 API 서버에서 스펙 가져오는 중...');
  const html = await fetchSpecHtml();
  spec = extractSpec(html);
  writeFileSync(OUTPUT_SPEC, JSON.stringify(spec, null, 2));
  console.log(`✅ ${OUTPUT_SPEC} 저장 완료`);
} catch (e) {
  console.warn(`⚠️  서버 연결 실패 (${e.message})`);
  console.log(`📂 로컬 ${OUTPUT_SPEC} 사용 중...`);
  const { readFileSync, existsSync } = await import('fs');
  if (!existsSync(OUTPUT_SPEC)) {
    console.error(`❌ ${OUTPUT_SPEC} 파일이 없습니다. 서버 연결을 확인하세요.`);
    process.exit(1);
  }
}

console.log('🔧 TypeScript 타입 생성 중...');
execSync(`openapi-typescript ${OUTPUT_SPEC} -o ${OUTPUT_TYPES}`, { stdio: 'inherit' });
console.log(`✅ ${OUTPUT_TYPES} 생성 완료`);
