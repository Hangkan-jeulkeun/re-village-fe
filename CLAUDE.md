# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# re-village-fe

## 프로젝트 스택
- Next.js 16 (App Router)
- React 19
- TypeScript (strict mode)
- Zustand (상태 관리)
- @vapor-ui/core, @vapor-ui/icons (UI 컴포넌트)
- CSS Modules
- Path alias: `@/*` → `./src/*`

## 디렉토리 구조
```
src/
  app/          # Next.js App Router (라우팅 전용)
  components/   # 공통 컴포넌트
  features/     # 기능 단위 모듈 (컴포넌트 + 훅 + 스토어)
  hooks/        # 공통 커스텀 훅
  stores/       # Zustand 스토어
  types/        # 공통 타입 정의
  utils/        # 유틸 함수
  lib/          # 외부 서비스 클라이언트 (API 등)
```

## TypeScript
- `any` 사용 금지. 타입을 모르면 `unknown` 사용 후 narrowing
- `as` 타입 단언은 불가피한 경우에만, 주석으로 이유 명시
- 컴포넌트 Props는 `interface`로 선언
- 함수 반환 타입은 복잡한 경우에만 명시, 단순한 경우 추론에 맡김

## React / Next.js
- 기본은 Server Component, 클라이언트 기능 필요 시에만 `'use client'`
- `'use client'` 범위를 최소화 — leaf 컴포넌트에 내리기
- 컴포넌트 파일명: `PascalCase.tsx`
- 이벤트 핸들러 이름: `handle` 접두사 (e.g. `handleClick`)
- 페이지/레이아웃 이외 컴포넌트는 `app/` 밖에 배치
- 리스트 `key`는 index 대신 고유 식별자 사용

## 컴포넌트 export
- named export 사용 (default export는 page/layout만 허용)

## 상태 관리 (Zustand)
- 스토어 파일명: `use[Feature]Store.ts`
- 컴포넌트에서는 필요한 slice만 구독

## UI (@vapor-ui)
- HTML 기본 요소보다 @vapor-ui 컴포넌트 우선 사용
- 커스텀 스타일이 필요하면 CSS Modules로 오버라이드

## 스타일 (CSS Modules)
- 클래스명: camelCase
- 인라인 스타일 금지 (동적 값 제외)
- 전역 스타일은 `globals.css`만 사용

## 임포트 순서
1. React / Next.js
2. 외부 라이브러리
3. 내부 모듈 (`@/...`)
4. 타입 (`import type`)
5. 스타일 (`.module.css`)

## 금지 사항
- `console.log` 커밋 금지
- `@ts-ignore` / `eslint-disable` 주석 없이 사용 금지
- `TODO` 주석은 작성자와 이유 명시: `// TODO(이름): 이유`
