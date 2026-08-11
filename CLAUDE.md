# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Next.js + Supabase 인증 스타터 킷. `supabase-ssr`를 사용해 쿠키 기반 Supabase Auth 세션을 App Router 전 영역(Server Components, Client Components, Route Handlers, Server Actions, Proxy)에서 공유한다.

## Commands

```bash
npm run dev           # 개발 서버 (localhost:3000)
npm run build         # 프로덕션 빌드
npm run start         # 프로덕션 서버 실행
npm run lint          # ESLint 검사 (next/core-web-vitals, next/typescript, eslint-config-prettier)
npm run lint:fix      # ESLint 자동 수정
npm run typecheck     # tsc --noEmit
npm run format        # Prettier로 전체 포맷팅 (Tailwind 클래스 자동 정렬 포함)
npm run format:check  # Prettier 포맷 검사만 수행 (CI용)
npm run check-all     # lint + typecheck + format:check 순차 실행
```

- 테스트 프레임워크는 구성되어 있지 않다.
- 새 shadcn/ui 컴포넌트 추가: `npx shadcn@latest add <component>`
- **Git 훅(Husky)**: `pre-commit`에서 `lint-staged`(스테이징된 파일에 eslint --fix + prettier --write)를 실행하고, `pre-push`에서 `typecheck`+`lint` 전체 검사를 실행한다. 타입체크는 프로젝트 전체 타입 그래프가 필요해 파일 단위 부분 검사가 불가능하므로 매 커밋이 아닌 push 시점에 배치했다.
- **CI**: `.github/workflows/ci.yml`이 push/PR마다 lint → typecheck → build를 실행한다. Supabase 환경변수는 placeholder 값을 워크플로우에 하드코딩해 사용한다(실제 자격증명 불필요).

## Environment

`.env.local`에 다음 변수가 필요하다:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`lib/utils.ts`의 `hasEnvVars`가 두 값의 존재 여부를 판단하며, `components/env-var-warning.tsx`는 값이 없을 때 UI에 경고를 표시하고 `lib/supabase/proxy.ts`는 값이 없으면 세션 체크를 건너뛴다.

## Architecture

### 인증 흐름과 Supabase 클라이언트 3분할

`lib/supabase/`에 실행 컨텍스트별로 클라이언트 생성 함수가 분리되어 있으며, 이 셋을 혼용하지 않는 것이 핵심 규칙이다.

- `client.ts` — `createBrowserClient`, Client Component(`"use client"`)에서만 사용
- `server.ts` — `createServerClient` + `next/headers`의 `cookies()`, Server Component/Server Action/Route Handler에서 사용. Fluid compute 환경을 고려해 전역 변수에 저장하지 않고 함수 호출마다 새로 생성한다.
- `proxy.ts` — 요청 단위로 세션을 검증/갱신하는 `updateSession()`. 루트의 `proxy.ts`가 이를 감싸서 Next.js 16의 `proxy` 컨벤션(과거 `middleware.ts`에 대응)으로 노출한다. `supabase.auth.getClaims()` 호출 전후로 코드를 끼워넣지 말 것 — 순서를 깨면 사용자가 임의로 로그아웃되는 문제가 생긴다.

인증되지 않은 사용자가 `/`, `/login*`, `/auth*` 이외의 경로에 접근하면 proxy가 `/auth/login`으로 리다이렉트한다.

### 데이터베이스: profiles 테이블

`supabase/migrations/`에 SQL 마이그레이션이 순서대로 있다. `public.profiles`는 `auth.users`와 1:1(트리거로 동기화)이며 RLS로 본인 행만 select/update 가능하다. insert/delete용 정책은 의도적으로 없다 — 생성은 `handle_new_user` 트리거(security definer)를 통해서만, 삭제는 `auth.users` 삭제 시 `on delete cascade`로만 이루어진다. 트리거 함수들은 `search_path = ''`로 고정되고 public 실행 권한이 revoke되어 있으니(뒤 두 마이그레이션 참고), 새 마이그레이션에서도 같은 보안 패턴을 유지한다.

`lib/supabase/database.types.ts`는 Supabase 스키마에서 생성된 타입이며, 스키마를 바꾼 뒤에는 `mcp__supabase__generate_typescript_types`(또는 `supabase gen types`)로 재생성해야 한다. `lib/supabase/profile.ts`의 `getUserProfile()`이 로그인 사용자의 profile row를 읽는 표준 방법이다.

### 경로 별칭과 폴더 배치

`tsconfig.json`의 `@/*`는 리포지토리 루트를 가리킨다(`src/` 디렉터리 없음 — `app/`, `components/`, `lib/`가 모두 루트에 위치). `docs/guides/*.md`는 일반적인 Next.js/React 패턴 가이드이며 `src/` 기준 예시가 섞여 있으니, 실제 파일 배치는 이 리포지토리의 현재 구조(`app/`, `components/`, `components/ui/`, `components/tutorial/`, `lib/`)를 따른다.

- `components/ui/` — shadcn/ui 원자 컴포넌트 (new-york 스타일, `components.json` 참고)
- `components/tutorial/` — 스타터 킷 기본 온보딩 UI, 실제 기능 추가 시 참고용이며 대체 대상
- `app/auth/*` — 로그인/회원가입/비밀번호 재설정 등 인증 페이지, `app/auth/confirm/route.ts`가 이메일 확인 콜백 처리
- `app/protected/*` — 로그인 필요 페이지 (proxy에서 강제되므로 페이지 자체 가드는 최소한만 필요)

## MCP / 툴 사용 지침

- Supabase 관련 작업(테이블 조회, 마이그레이션 적용, advisor/로그 확인, 타입 생성)은 `mcp__supabase__*` 툴을 사용한다. 스키마 변경 전 `list_tables`로 현재 구조를 확인하고, 문제 디버깅 시 `get_advisors`/`get_logs`부터 확인한다.
- 라이브러리/프레임워크 문서(Next.js, Supabase, shadcn/ui 등) 조회는 Context7 MCP를 우선 사용한다.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
