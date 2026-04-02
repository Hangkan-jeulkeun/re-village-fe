# Auth Token 관리

## 개요

신청자 인증(전화번호 인증) 또는 어드민 로그인 시 서버로부터 `accessToken` / `refreshToken`을 발급받아
이후의 인증 필요 API 호출에 자동으로 사용하는 흐름을 설명한다.

---

## 토큰 발급 경로

| 진입점               | 엔드포인트                                      | 훅                    |
| -------------------- | ----------------------------------------------- | --------------------- |
| 신청자 인증번호 검증 | `POST /api/v1/applications/verification/verify` | `useVerifySubmitCode` |
| 어드민 로그인        | `POST /api/v1/auth/login`                       | `useLogin`            |

두 훅의 `onSuccess`에서 공통으로 `useAuthStore.getState().setTokens(data)`를 호출해 토큰을 저장한다.

---

## 토큰 저장 — `useAuthStore`

```
src/stores/useAuthStore.ts
```

Zustand + `persist` 미들웨어로 **localStorage** (`auth-storage` 키)에 저장된다.
페이지 새로고침 후에도 토큰이 유지된다.

```ts
const { accessToken, refreshToken, setTokens, clearTokens } = useAuthStore();
```

| 메서드              | 설명                                  |
| ------------------- | ------------------------------------- |
| `setTokens(tokens)` | accessToken, refreshToken 저장        |
| `clearTokens()`     | 두 토큰 모두 null로 초기화 (로그아웃) |

---

## 자동 토큰 주입 — `apiClient` 미들웨어

```
src/lib/apiClient.ts
```

`openapi-fetch` Middleware를 통해 **모든 API 요청에 자동으로** Authorization 헤더를 주입한다.
별도 설정 없이 `useAuthStore`에 accessToken이 있으면 동작한다.

```
onRequest: Authorization: Bearer {accessToken} 헤더 자동 추가
```

---

## 토큰 갱신 흐름

```
API 요청 → 401 응답
    ↓
refreshToken 존재?  →  없음  →  401 그대로 반환
    ↓ 있음
POST /api/v1/auth/refresh (Authorization: Bearer {refreshToken})
    ↓
성공 → setTokens(새 토큰) → 원본 요청 재시도 → 성공 응답 반환
실패 → clearTokens() → 401 그대로 반환
```

- 동시에 여러 요청이 401을 받아도 refresh 요청은 **단 한 번만** 발생한다 (`refreshPromise` 싱글턴).
- 재시도 요청은 `openapi-fetch` 미들웨어를 거치지 않는 native `fetch`로 실행된다.

---

## 인증이 필요한 엔드포인트

| 메서드 | 경로                                 |
| ------ | ------------------------------------ |
| POST   | `/api/v1/auth/refresh`               |
| POST   | `/api/v1/applications`               |
| GET    | `/api/v1/applications/me`            |
| GET    | `/api/v1/applications/me/{id}`       |
| GET    | `/api/v1/applications/{id}/analysis` |
| PATCH  | `/api/v1/applications/{id}/cancel`   |
| GET    | `/api/v1/applications/admin/summary` |
| GET    | `/api/v1/applications/admin/list`    |
| GET    | `/api/v1/applications/admin/kanban`  |
| GET    | `/api/v1/applications/admin/{id}`    |
| PATCH  | `/api/v1/applications/{id}/status`   |

---

## 로그아웃 처리

```ts
import { useAuthStore } from '@/stores/useAuthStore';

useAuthStore.getState().clearTokens();
// 또는 컴포넌트 내부
const { clearTokens } = useAuthStore();
clearTokens();
```

`clearTokens()` 호출 시 localStorage에서도 즉시 제거된다.

---

## 관련 파일

```
src/types/auth.ts                     — TokenResponse 타입
src/stores/useAuthStore.ts            — 토큰 상태 관리
src/lib/apiClient.ts                  — 미들웨어 (주입 + 갱신)
src/features/applications/queries.ts — useVerifySubmitCode (setTokens)
src/features/auth/queries.ts          — useLogin (setTokens)
```
