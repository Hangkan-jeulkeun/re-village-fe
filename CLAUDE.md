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

### App Router 핵심 개념 (Next.js 처음이라면 반드시 읽기)

**Server Component vs Client Component**
- Server Component: 기본값. `async` 가능, DB/API 직접 호출 가능. `useState`, `useEffect`, 이벤트 핸들러 사용 불가.
- Client Component: 파일 상단에 `'use client'` 선언. 브라우저 API, 훅, 이벤트 핸들러 사용 가능.
- 규칙: Server Component가 Client Component를 import할 수 있지만, 반대는 불가.

**app/ 디렉토리 파일 규칙**
- `page.tsx` — 라우트의 실제 UI. `app/about/page.tsx` → `/about`
- `layout.tsx` — 하위 페이지를 감싸는 공통 레이아웃. `children` prop 받음.
- `loading.tsx` — 페이지 로딩 중 보여줄 UI (자동으로 Suspense 처리)
- `error.tsx` — 에러 발생 시 UI. 반드시 `'use client'`
- `not-found.tsx` — 404 UI

**데이터 페칭**
```tsx
// Server Component에서 직접 fetch (권장)
export default async function Page() {
  const data = await fetch('https://...').then(r => r.json())
  return <div>{data.title}</div>
}
```

**라우팅 / 네비게이션**
- 페이지 이동: `next/link`의 `<Link href="/path">`
- 프로그래매틱 이동: `'use client'` + `useRouter()` from `next/navigation`
- 현재 경로: `usePathname()` from `next/navigation`
- 쿼리스트링: `useSearchParams()` from `next/navigation`

**주의: Pages Router와 다른 점**
- `getServerSideProps`, `getStaticProps` 없음 → async Server Component로 대체
- `useRouter` import 경로가 `next/router` 아닌 `next/navigation`
- `_app.tsx`, `_document.tsx` 없음 → `app/layout.tsx`로 대체

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

## 브랜치 규칙
- 형식: `<prefix>/#<이슈번호>-<간단한-설명>`
- prefix 종류: `feat`, `fix`, `chore`
- 예시: `feat/#12-login-page`, `fix/#34-header-bug`, `chore/#5-setup-eslint`
- 설명은 kebab-case, 영문 소문자

## 기능 명세
- 기능 명세는 `docs/features/` 에 마크다운으로 관리
- 브랜치 생성 시 관련 명세 파일을 읽고 브랜치 설명을 자동 생성할 것
- 스펙이 변경되면 반드시 `docs/features/` 를 먼저 수정한 뒤 코드를 수정할 것
- 코드와 스펙이 충돌하면 스펙을 기준으로 삼을 것

## 금지 사항
- `console.log` 커밋 금지
- `@ts-ignore` / `eslint-disable` 주석 없이 사용 금지
- `TODO` 주석은 작성자와 이유 명시: `// TODO(이름): 이유`
