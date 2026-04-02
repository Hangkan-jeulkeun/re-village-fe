주어진 인자($ARGUMENTS)에 따라 아래와 같이 동작한다.

## 인자별 동작

### `/define-api gen:types`

`pnpm gen:types`만 실행해 서버에서 최신 스펙을 가져오고 `openapi.json`과 `src/types/api.ts`를 갱신한다. 파일 생성은 하지 않는다.

### `/define-api [API 경로]`

1. `pnpm gen:types`를 실행해 서버에서 최신 스펙을 가져오고 `openapi.json`과 `src/types/api.ts`를 갱신한다.
2. 갱신된 `openapi.json`을 읽고 파일을 자동 생성한다.

## 규칙

- API 경로에서 도메인을 추출한다. 예: `/api/v1/applications` → `applications`, `/api/v1/assets` → `assets`
- 생성 위치: `src/features/[도메인]/`
- **정확히 해당 경로에 정의된 메서드만** 처리한다. 하위 경로는 포함하지 않는다.
  - 예: `/api/v1/applications` → `POST /api/v1/applications` 만 처리, `/api/v1/applications/lookup/*` 제외
- 이미 파일이 있으면 덮어쓰지 않고 병합한다

## 생성할 파일

### 1. `src/features/[도메인]/api.ts`

- `openapi.json`에서 **지정된 경로와 정확히 일치하는** 경로의 모든 메서드(GET, POST, PATCH 등)를 확인한다
- `apiClient`(`@/lib/apiClient`)를 import한다
- request body가 있는 경우 `components['schemas']`에서 타입을 추출해 export한다
- 각 엔드포인트를 `[도메인]Api` 객체의 메서드로 정의한다
- path parameter가 있으면 함수 인자로 받는다

### 2. `src/features/[도메인]/queries.ts`

- `'use client'` 선언을 파일 상단에 추가한다
- `useQuery`는 GET 엔드포인트에, `useMutation`은 POST/PATCH/DELETE에 대응한다
- query key는 `[도메인]Keys` 객체로 정의한다
- mutation 성공 시 관련 query를 `invalidateQueries`로 무효화한다
- 에러는 `if (error) throw error` 패턴으로 처리한다

## 참고 패턴

```ts
// api.ts
import { apiClient } from '@/lib/apiClient';
import type { components } from '@/types/api';

export type CreateXxxRequest = components['schemas']['CreateXxxDto'];

export const xxxApi = {
  findAll: () => apiClient.GET('/api/v1/xxx'),
  create: (body: CreateXxxRequest) => apiClient.POST('/api/v1/xxx', { body }),
  findOne: (id: string) =>
    apiClient.GET('/api/v1/xxx/{id}', { params: { path: { id } } }),
};
```

```ts
// queries.ts
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { xxxApi } from './api';
import type { CreateXxxRequest } from './api';

export const xxxKeys = {
  all: ['xxx'] as const,
  detail: (id: string) => [...xxxKeys.all, id] as const,
};

export function useXxxList() {
  return useQuery({
    queryKey: xxxKeys.all,
    queryFn: async () => {
      const { data, error } = await xxxApi.findAll();
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateXxx() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateXxxRequest) => {
      const { data, error } = await xxxApi.create(body);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: xxxKeys.all });
    },
  });
}
```

## 컴포넌트에서 사용 예시

```tsx
// useQuery — 데이터 조회
'use client';

import { useXxxList } from '@/features/xxx/queries';

export function XxxList() {
  const { data, isPending, isError } = useXxxList();

  if (isPending) return <div>로딩 중...</div>;
  if (isError) return <div>오류가 발생했습니다.</div>;

  return (
    <ul>
      {data?.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

```tsx
// useMutation — 데이터 변경
'use client';

import { useCreateXxx } from '@/features/xxx/queries';

export function XxxForm() {
  const { mutate, isPending } = useCreateXxx();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate({ name: formData.get('name') as string });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? '저장 중...' : '저장'}
      </button>
    </form>
  );
}
```
