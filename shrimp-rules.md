# Development Guidelines (AI Agent 전용)

이 문서는 AI Coding Agent가 이 저장소에서 작업할 때 지켜야 할 **프로젝트 고유 규칙**만 담는다. Next.js/React/TypeScript 일반 지식은 포함하지 않는다.

## 프로젝트 개요

- Next.js(App Router) + Supabase 인증 스타터킷에서 출발해 **"모임 매니저"**(정기 모임 공지·RSVP·카풀·정산 통합 서비스) 도메인 앱으로 확장 중.
- 인증/DB 클라이언트 기반(`lib/supabase/*`, `public.profiles`)은 이미 완성된 선행 구조이며 **재작업 대상 아님** — 새 기능은 이 기반 위에 쌓는다.
- 전체 로드맵과 Task 목록은 `docs/ROADMAP.md`에 있다. 새 기능 작업 전 반드시 이 파일에서 해당 Phase/Task를 확인한다.

## 폴더 구조 — `src/` 없음, 실제 구조 우선

- 이 저장소는 `src/` 디렉터리를 사용하지 않는다. `app/`, `components/`, `lib/`가 리포지토리 **루트**에 위치한다.
- `docs/guides/*.md`(component-patterns.md, forms-react-hook-form.md, nextjs-15.md, project-structure.md, styling-guide.md)는 `src/` 기준 예시가 섞인 **일반 참고 문서**다. 경로 예시(`src/app/...`, `src/lib/...`)를 그대로 따르지 말고, 실제 배치는 현재 루트 구조(`app/`, `components/`, `components/ui/`, `components/tutorial/`, `lib/`)를 기준으로 한다.
- `docs/guides/forms-react-hook-form.md`는 `react-hook-form`/`zod`/`@hookform/resolvers`가 "이미 설치됨"이라 적혀 있지만 **`package.json`에 아직 없다**. 이 라이브러리들을 실제로 사용하는 코드를 작성하기 전 `package.json`으로 설치 여부를 먼저 확인하고, 없으면 설치부터 진행한다.
- 새 도메인 타입은 `lib/types/*.ts`(예: `lib/types/group.ts`)에 만든다 — `docs/ROADMAP.md` Task 003 명명 규칙을 따른다.

## Supabase 클라이언트 3분할 — 혼용 금지

- `lib/supabase/client.ts`: `"use client"` 컴포넌트 전용. Server Component/Server Action에서 import 금지.
- `lib/supabase/server.ts`: Server Component/Server Action/Route Handler 전용. **함수 호출마다 새로 `createClient()`를 호출**해야 하며, 결과를 전역 변수/모듈 스코프에 캐싱하지 않는다(Fluid compute 대응).
- `lib/supabase/proxy.ts` + 루트 `proxy.ts`: 요청 단위 세션 갱신 전용. 이 두 파일 외의 위치에서 세션 갱신 로직을 새로 만들지 않는다.
- `lib/supabase/proxy.ts`의 `createServerClient(...)` 호출과 `supabase.auth.getClaims()` 호출 **사이에 어떤 코드도 추가하지 않는다** — 순서를 깨면 사용자가 임의로 로그아웃되는 회귀가 발생한다.
- `updateSession()`이 반환하는 `supabaseResponse`(또는 그 쿠키를 복사한 새 응답)를 그대로 반환해야 한다 — 쿠키를 누락한 새 `NextResponse`로 교체하지 않는다.

## `public.profiles` 테이블 — RLS 패턴 고정

- `profiles`에 대한 **insert/delete RLS 정책을 추가하지 않는다.** insert는 `handle_new_user`(security definer 트리거), delete는 `auth.users` 삭제 시 `on delete cascade`로만 발생해야 한다.
- select/update 정책은 `auth.uid() = id` 형태의 본인 행 제한을 유지한다(마이그레이션 `20260810091531_create_profiles_table.sql` 참고).
- 새 트리거 함수를 작성할 때는 기존 패턴을 그대로 따른다: `security definer`(필요한 경우), `set search_path = ''` 고정, 그리고 별도 마이그레이션으로 `public`/`authenticated` role의 `EXECUTE` 권한을 revoke한다(`20260810091554_*.sql`, `20260810091611_*.sql` 참고).
- 모임 매니저 도메인 테이블(`groups`, `group_members`, `events`, `announcements`, `rsvps`, `carpool_entries`, `expenses`, `expense_shares`)을 추가할 때도 동일한 보안 패턴(RLS 활성화, `search_path` 고정, 트리거 권한 revoke)을 적용한다.
- 스키마를 변경하면 **반드시** 다음을 함께 수행한다: (1) `supabase/migrations/`에 새 SQL 마이그레이션 추가, (2) `mcp__supabase__apply_migration`으로 적용, (3) `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts` 재생성, (4) `mcp__supabase__get_advisors`로 RLS 누락 등 critical 경고 확인.

## 인증되지 않은 사용자 리다이렉트 규칙

- `lib/supabase/proxy.ts`의 리다이렉트 조건은 `/`, `/login*`, `/auth*`를 예외로 둔다. 새 공개 라우트(로그인 불필요)를 추가하려면 이 조건문을 함께 수정해야 하며, 그렇지 않으면 신규 공개 페이지가 `/auth/login`으로 강제 리다이렉트된다.
- `app/protected/*` 하위 페이지는 proxy가 인증을 강제하므로 페이지 컴포넌트 자체의 가드는 최소화한다(기존 `app/protected/page.tsx`의 `getClaims()` 재확인 패턴 정도로 충분).
- 초대 합류(`/invite/[code]`) 같은 신규 라우트를 추가할 때는 로그인 여부와 무관하게 접근 가능해야 하는지 먼저 확인하고, 필요 시 proxy 예외 조건에 경로를 추가한다.

## 코드 스타일 — 프로젝트 고유 강제 사항

- `any` 타입 사용 금지(전역 CLAUDE.md 규칙, 이 저장소에서도 동일 적용).
- 컴포넌트/타입: PascalCase, 변수: camelCase, 상수: UPPER_SNAKE_CASE, boolean은 `is`/`has` 접두사(`isPinned`, `hasEnvVars` 패턴 참고).
- 함수형 컴포넌트에 간단한 JSDoc(한국어)을 다는 기존 패턴을 유지한다(`lib/supabase/profile.ts`, `components/google-signin-button.tsx` 참고) — WHAT이 아니라 왜/제약을 설명할 때만 작성.
- `Input`/`Label`/`Button`/`Card` 등은 항상 `components/ui/`에서 import한다. 동일 기능의 컴포넌트를 다른 위치에 새로 만들지 않는다.
- 새 shadcn/ui 컴포넌트가 필요하면 `npx shadcn@latest add <component>`로 추가한다(직접 코드를 복사해 넣지 않는다).
- Prettier(`prettier-plugin-tailwindcss`)가 Tailwind 클래스 순서를 자동 정렬하므로, Tailwind 클래스 순서를 수동으로 맞추려 하지 않는다 — `npm run format`에 위임한다.

## Server Action / 폼 처리

- 로그인/회원가입/OAuth 폼은 `"use client"` + 로컬 `useState`(email/password/error/isLoading) 패턴을 따른다(`components/login-form.tsx`, `components/sign-up-form.tsx`). 모임 매니저 도메인의 새 폼(모임 생성 등)은 `docs/ROADMAP.md` Task 006 지시대로 React Hook Form + Zod + Server Action 조합으로 작성한다 — 기존 인증 폼과 패턴이 다름을 인지하고 섞지 않는다.
- Google OAuth는 `components/google-signin-button.tsx` → `app/auth/callback/route.ts`(code 교환) 흐름을 그대로 재사용한다. 새로운 OAuth 프로바이더를 추가할 때도 동일한 콜백 라우트 패턴(`exchangeCodeForSession` + `next` 쿼리 파라미터)을 따른다.
- 에러 발생 시 `error instanceof Error ? error.message : "An error occurred"` 패턴으로 처리하는 기존 관례를 유지한다.

## 작업 워크플로우 (`docs/ROADMAP.md` 기준)

- 모임 매니저 도메인 기능을 구현할 때는 `docs/ROADMAP.md`의 Phase/Task 순서를 따른다. Phase 3(Task 013) 이전에는 실제 DB 스키마 마이그레이션을 만들지 않고 더미 데이터로 UI만 완성한다 — Phase 2 작업에서 임의로 Supabase 테이블을 먼저 만들지 않는다.
- API/비즈니스 로직을 구현하는 Task는 **Playwright MCP(`mcp__playwright__*`)를 사용한 E2E 테스트가 필수**다. 단순 UI 마크업/더미 데이터 Task는 필수가 아니다.
- Task 완료 후 `docs/ROADMAP.md`에서 해당 체크박스를 `- [x]`로 갱신한다(직접 편집하거나 `docs:update-roadmap` 스킬 사용).
- `/tasks/XXX-description.md` 형식의 개별 작업 파일 워크플로우가 로드맵에 정의되어 있지만 현재 `/tasks` 디렉터리는 존재하지 않는다 — 이 워크플로우를 요청받으면 먼저 사용자에게 `/tasks` 디렉터리를 새로 만들지 확인한다.

## MCP 툴 사용 규칙

- Supabase 테이블 조회/마이그레이션/타입 생성/로그·advisor 확인은 항상 `mcp__supabase__*` 툴을 사용한다. 로컬 `psql` 명령어나 Supabase 대시보드 수작업으로 대체하지 않는다.
- 라이브러리/프레임워크 문서(Next.js, Supabase, shadcn/ui, react-hook-form 등)를 확인할 때는 Context7 MCP를 웹 검색보다 우선 사용한다.

## 금지 사항

- `lib/supabase/client.ts` / `server.ts`의 클라이언트 생성 함수를 전역 변수에 캐싱하는 방식으로 변경하지 않는다.
- `lib/supabase/proxy.ts`의 `createServerClient` ~ `getClaims()` 구간에 로직을 끼워넣지 않는다.
- `profiles` 테이블에 insert/delete RLS 정책을 추가하지 않는다.
- `components/tutorial/*`는 스타터킷 온보딩용이며 모임 매니저 실제 기능 화면으로 그대로 재사용하지 않는다(대체 대상, 참고용).
- `docs/guides/*.md`의 `src/` 기준 경로 예시를 그대로 복사해 파일을 생성하지 않는다.
- 새 트리거 함수에서 `search_path` 고정과 `EXECUTE` 권한 revoke를 생략하지 않는다.
- 스키마 변경 후 `lib/supabase/database.types.ts` 재생성을 생략하지 않는다.
