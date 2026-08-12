# 모임 매니저 개발 로드맵

카카오톡 + 엑셀 + 수기 정산으로 처리하던 정기 모임의 공지·참여자·카풀·정산 업무를 한 곳에서 처리하는 모임 운영 통합 서비스

## 개요

모임 매니저는 수영·헬스·러닝 등 **정기 모임을 운영하는 주최자와 참여 멤버**를 위한 **모임 운영 올인원 플랫폼**으로 다음 기능을 제공합니다:

- **모임/회차 관리**: 모임 기본정보와 반복 규칙을 등록하면 회차가 자동 생성되고, 개별 회차의 휴강·장소 변경도 수정 가능
- **초대 및 합류**: 초대 링크/코드로 신규 멤버를 단톡방 없이 바로 모임에 합류시킴
- **공지**: 모임/회차 단위 공지를 상단 고정·최신순으로 노출해 단톡방에 묻히는 공지 문제를 해결
- **RSVP 및 대기열**: 참석/불참/미정 응답과 정원 초과 시 자동 대기열·승격 처리로 수기 취합을 대체
- **참여자 관리**: 확정/대기/불참 현황과 비회원 게스트 동반을 주최자가 한눈에 파악
- **카풀**: 운전/탑승 희망을 게시판 형태로 등록·조회해 수작업 매칭의 누락과 중복을 줄임
- **비용 정산**: 비용 항목 등록과 참석 확정 인원 기준 N빵 자동 계산, 완납 여부 추적으로 수기 정산을 대체

### 선행 완료 사항 (재작업 대상 아님)

아래 기반 구조는 스타터킷 단계에서 이미 완료되어 있으며, 이후 Phase에서 별도 Task로 다시 만들지 않고 그대로 재사용합니다.

- `supabase-ssr` 기반 쿠키 세션 인증이 App Router 전 영역(Server Components/Client Components/Route Handlers/Server Actions/Proxy)에 구축 완료
- `lib/supabase/client.ts`(브라우저), `server.ts`(서버), `proxy.ts`(요청 단위 세션 갱신, 루트 `proxy.ts`가 Next.js proxy 컨벤션으로 노출) 3분할 구조 동작 확인됨
- `public.profiles` 테이블이 `auth.users`와 1:1로 존재 — `handle_new_user` 트리거 생성, cascade 삭제, RLS로 본인 행만 select/update
- `app/auth/*`(로그인/회원가입/비밀번호 재설정 등), `app/protected/*`(proxy 강제 인증) 라우트 존재
- `components/tutorial/`은 대체 대상인 스타터킷 기본 UI, `components/ui/`는 shadcn/ui 원자 컴포넌트로 계속 활용

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup-routes.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

모임 매니저 고유 도메인(모임/회차/공지/RSVP/참여자/카풀/정산)의 라우트, 레이아웃, 타입 정의 골격을 완성한다. 인증/DB 클라이언트 기반은 선행 완료 사항을 그대로 사용한다. 데이터베이스 스키마 마이그레이션은 Phase 2 UI 완성 이후 Phase 3 초반(Task 013)에 진행한다.

#### Task 001: 모임 매니저 라우트 구조 및 빈 페이지 생성 ✅ - 완료

- [x] `app/(main)/page.tsx` — 홈 페이지 라우트 생성 (내 모임 목록, 빈 셸)
- [x] `app/(main)/groups/new/page.tsx` — 모임 생성 페이지 라우트
- [x] `app/(main)/groups/[groupId]/page.tsx` — 모임 상세 페이지(공지/일정 탭 포함) 라우트
- [x] `app/(main)/groups/[groupId]/events/[eventId]/page.tsx` — 회차 상세 페이지 라우트
- [x] `app/(main)/groups/[groupId]/members/page.tsx` — 참여자 관리 페이지 라우트 (주최자 전용)
- [x] `app/(main)/groups/[groupId]/carpool/page.tsx` — 카풀 페이지 라우트
- [x] `app/(main)/groups/[groupId]/settlement/page.tsx` — 정산 페이지 라우트
- [x] `app/invite/[code]/page.tsx` — 초대 합류 페이지 라우트 (내비게이션 메뉴 미노출, `(main)`/`groups` 레이아웃 트리 밖 독립 세그먼트)
- [x] 각 페이지는 제목과 "준비 중" 플레이스홀더만 렌더링하는 최소 골격으로 작성
- [x] `app/protected/*` 등 기존 스타터킷 전용 라우트와 충돌 없는지 확인

**경로 수정 참고**: `groups/*` 경로는 `(main)` 공통 nav를 상속받아야 하므로 계획 당시 표기(`app/groups/...`)가 아니라 `app/(main)/groups/...`에 배치했다(`(main)`은 라우트 그룹이라 URL에는 영향 없음). 기존 `app/page.tsx`(스타터킷 튜토리얼 랜딩)는 `app/(main)/page.tsx`와 `/` 경로가 충돌해 삭제하고 대체했다.

**수락 기준**: 모든 라우트가 404 없이 접근 가능하고, 각 페이지가 최소한의 placeholder를 렌더링한다. → `npm run check-all`(lint+typecheck+format) 통과로 확인.

#### Task 002: 공통 레이아웃과 내비게이션 골격 구현 ✅ - 완료

- [x] 로그인 후 공통 메뉴 레이아웃 구현 — 홈 / 모임 만들기 / 로그아웃 (기존 인증 상태를 `lib/supabase/server.ts` 기반으로 판별)
- [x] 모임 진입 후(특정 `groupId` 하위) 탭 메뉴 골격 구현 — 공지·일정 / 카풀 / 정산 / 참여자 관리(주최자 전용)
- [x] 참여자 관리 탭은 role이 owner인 경우만 노출되도록 조건부 렌더링 자리(placeholder 로직) 마련
- [x] 모바일/데스크톱 반응형 레이아웃 뼈대 적용 (Tailwind 기준 breakpoint)
- [x] 초대 합류 페이지는 내비게이션에 노출되지 않음을 확인

**구현 참고**: role 판별 타입은 `lib/types/group.ts`가 아직 없어 `app/(main)/groups/[groupId]/layout.tsx` 내부에 임시 로컬 유니온 타입(`GroupMemberRole`)으로 선언했다. Task 003에서 공유 타입이 생기면 이 로컬 선언을 import로 교체할 예정이다.

**수락 기준**: 임의의 모임 상세 하위 경로 진입 시 공통 탭 메뉴가 표시되고, 화면 너비에 따라 레이아웃이 깨지지 않는다.

#### Task 003: 도메인 타입 및 인터페이스 정의 ✅ - 완료

- [x] `lib/types/group.ts` — `Group`, `GroupMember`(role: `"owner" | "member"`) 타입 정의, `app/(main)/groups/[groupId]/layout.tsx`의 임시 로컬 `GroupMemberRole` 선언을 이 공유 타입 import로 교체
- [x] `lib/types/event.ts` — `Event`(회차) 타입 정의
- [x] `lib/types/announcement.ts` — `Announcement` 타입 정의 (모임/회차 단위 구분 필드 포함)
- [x] `lib/types/rsvp.ts` — `Rsvp`(status: `"attending" | "not_attending" | "undecided" | "waitlisted"`) 타입 정의
- [x] `lib/types/carpool.ts` — `CarpoolEntry`(type: `"driver" | "passenger"`) 타입 정의
- [x] `lib/types/settlement.ts` — `Expense`, `ExpenseShare` 타입 정의
- [x] 모든 타입/인터페이스명은 PascalCase, boolean 필드는 `is`/`has` 접두사 유지 (`isPinned`, `isPaid` 등)
- [x] `any` 타입 사용 금지 원칙 준수, 각 타입에 간단한 JSDoc(한국어) 주석 추가

**수락 기준**: `npm run typecheck` 통과, Phase 2 UI 작업에서 더미 데이터가 이 타입들로 타입체크된다. → 확인 완료.

---

### Phase 2: UI/UX 완성 (더미 데이터 활용)

Phase 1에서 만든 골격 위에 실제 데이터 연동 없이 하드코딩된 더미 데이터로 전 페이지 UI를 완성한다.

#### Task 004: 공통 컴포넌트 라이브러리 및 디자인 시스템 정리 ✅ - 완료

- [x] 모임 카드, 회차 카드, 상태 배지(참석/불참/미정/대기, 완납/미납), 빈 상태(empty state) 컴포넌트를 `components/`에 구현
- [x] 필요한 shadcn/ui 컴포넌트 추가 (`npx shadcn@latest add <component>`: dialog, tabs, badge, form 등)
- [x] 버튼/타이포/간격 등 디자인 토큰을 Tailwind 기준으로 일관되게 정리
- [x] 컴포넌트 단위로 반응형(모바일 우선) 및 접근성(라벨, 포커스 스타일, 대비) 검증

**구현 참고**: 신규 컴포넌트는 기존 `components/*.tsx` 관례를 따라 도메인 폴더 구분 없이 flat하게 배치했다(`group-card.tsx`, `event-card.tsx`, `rsvp-status-badge.tsx`, `payment-status-badge.tsx`, `empty-state.tsx`). 상태 배지 색상은 컴포넌트마다 하드코딩하지 않고 `components/ui/badge.tsx`의 `badgeVariants`에 `success`/`warning` variant를 추가해 한 곳에서 관리한다. `npx shadcn@latest add form` 실행 시 CLI가 최신 스타일로 기존 `button.tsx`/`label.tsx`를 덮어써 `google-signin-button.tsx`가 참조하는 `ButtonProps` export가 사라지는 회귀가 있어, 두 파일은 원래 버전으로 되돌리고 새로 추가한 8개 프리미티브 파일만 반영했다. Phase 2 전체(Task 006 폼 등)에서 쓰일 `react-hook-form`/`zod`/`@hookform/resolvers` 의존성이 이번에 함께 설치됐다.

**수락 기준**: 이후 Phase 2 페이지 Task들이 이 컴포넌트를 재사용하며, `npm run lint` 경고가 없다. → `npm run check-all` 통과로 확인.

#### Task 005: 홈 페이지 UI 구현 (더미 데이터) ✅ - 완료

- [x] 소속 모임 목록 카드 UI (모임별 다가오는 회차 일정 포함)
- [x] 속한 모임이 없을 때의 빈 상태 UI ("모임 만들기" 유도)
- [x] "모임 만들기" 버튼 배치
- [x] `lib/types/group.ts`, `lib/types/event.ts` 타입을 사용한 더미 데이터 배열로 렌더링

**구현 참고**: `app/(main)/layout.tsx`의 공통 컨테이너가 `max-w-md`로 고정되어 데스크톱에서도 항상 1열이라, 카드 목록은 `grid-cols-*` breakpoint 대신 단순 `flex flex-col gap-4` 세로 스택으로 구현했다(레이아웃 폭은 그대로 유지하기로 결정, `layout.tsx` 미수정). 신규 컴포넌트 없이 Task 004의 `GroupCard`/`EmptyState`/`Button`(asChild)을 그대로 조립했다. 더미 데이터는 `nextEvent` 있음/없음 두 케이스를 모두 포함해 `GroupCard`의 두 렌더 분기를 시연하며, `npm run dev` + Playwright로 모임 있음/빈 상태 두 화면을 실제 브라우저에서 스크린샷으로 확인했다.

**수락 기준**: 모임 있음/없음 두 케이스 모두 디자인 확인 가능, 반응형 breakpoint에서 카드 레이아웃 정상 동작. → Playwright로 두 상태 시각 확인, `npm run check-all` 통과로 확인.

#### Task 006: 모임 생성 페이지 UI 구현 ✅ - 완료

- [x] React Hook Form + Zod로 모임 이름/카테고리/소개/정원 입력 폼 UI 구성 (제출 로직은 미연결)
- [x] 반복 규칙(매주/격주/매월, 요일) 선택 UI 구성
- [x] "모임 생성" 버튼 및 폼 검증 에러 메시지 UI

**구현 참고**: 반복 규칙 필드는 `lib/types/group.ts`의 `Group` 타입에 아직 없어 `app/(main)/groups/new/page.tsx` 내부 zod 스키마로만 로컬 정의했다(타입 파일은 수정하지 않음). 여기서 확립한 `Form`(components/ui/form.tsx) + `zodResolver` 패턴을 Task 008(회차 수정 폼)과 Task 010(게스트 추가 폼)이 그대로 재사용한다.

**수락 기준**: 폼 필드별 Zod 검증 에러가 UI에 표시되고, 제출 시 콘솔 로그 수준으로 값 확인 가능. → Playwright로 필수값 미입력 제출 시 6개 필드 모두 에러 메시지 노출 확인.

#### Task 007: 모임 상세 페이지 UI 구현 (공지/일정 탭) ✅ - 완료

- [x] 상단 고정 공지 우선 노출 + 최신순 공지 목록 UI (더미 데이터)
- [x] 회차(정기 일정) 목록 UI, 회차 선택 시 회차 상세로 이동하는 링크
- [x] 주최자 전용 "초대 링크 발급" 버튼 UI (클릭 시 더미 코드/링크 표시)
- [x] 주최자 전용 회차 개별 수정 진입 UI

**구현 참고**: 신규 `components/invite-link-button.tsx`(client)가 Dialog로 더미 초대 코드/링크를 표시한다. 페이지 로컬 `CURRENT_USER_ROLE` 더미 상수(owner)로 주최자 전용 UI 노출을 조건부 분기했다 — `app/(main)/groups/[groupId]/layout.tsx`의 role-null 탭 로직과는 별개이며 그 파일은 수정하지 않았다(실제 role 배선은 Phase 3 Task 024).

**수락 기준**: 공지 상단 고정 정렬이 더미 데이터에서 시각적으로 확인되고, 주최자/일반 멤버 뷰가 조건부로 다르게 보이는 자리 표시가 있다. → Playwright로 고정 공지 최상단 노출, 초대 링크 다이얼로그 동작 확인.

#### Task 008: 회차 상세 페이지 UI 구현 (RSVP UI) ✅ - 완료

- [x] 회차 정보(일시/장소/정원) 표시 UI
- [x] 회차별 공지 표시 UI
- [x] 참석/불참/미정 RSVP 버튼 UI (선택 상태 하이라이트)
- [x] 정원 초과 시 대기열 등록 안내 및 대기 순번 표시 UI
- [x] 주최자 전용 회차 정보 수정 폼 UI

**구현 참고**: 신규 `components/event-rsvp-section.tsx`(client, 로컬 state로 RSVP 하이라이트+대기 순번 계산)와 `components/event-edit-dialog.tsx`(Task 006과 동일한 Form+zodResolver 패턴을 Dialog에 적용)를 만들었다. 더미 신청 인원(13명) > 정원(12명)으로 대기열 시나리오를 재현했다.

**수락 기준**: RSVP 버튼 클릭 시 로컬 상태(더미)로 선택 상태가 즉시 반영되고, 대기열 케이스가 더미 데이터로 재현된다. → Playwright로 참석 클릭 시 "대기 2번" 안내 노출 확인.

#### Task 009: 초대 합류 페이지 UI 구현 ✅ - 완료

- [x] 초대 대상 모임 정보 미리보기 UI (모임명/카테고리/소개)
- [x] "모임 합류하기" 버튼 UI
- [x] 유효하지 않은 초대 코드에 대한 에러 상태 UI

**구현 참고**: `DUMMY_GROUPS_BY_INVITE_CODE` 매핑(SWIM123, RUN456)으로 유효/무효 코드를 구분하고, 신규 `components/join-group-button.tsx`(client)로 합류 완료 상태 전환을 구현했다.

**수락 기준**: 정상/오류 케이스 모두 더미 데이터 기반으로 시각 확인 가능. → Playwright로 두 케이스 모두 확인.

#### Task 010: 참여자 관리 페이지 UI 구현 ✅ - 완료

- [x] 회차 선택 드롭다운/탭 UI
- [x] 확정/대기/불참 상태별 카운트 및 명단 UI
- [x] 대기열 순서 표시 UI
- [x] "게스트 추가" 버튼 및 게스트 등록 폼 UI

**구현 참고**: 게스트 추가 후 명단에 즉시 반영해야 해 `app/(main)/groups/[groupId]/members/page.tsx` 전체를 client component로 전환했다. 신규 `components/guest-add-dialog.tsx`가 Task 006 폼 패턴을 재사용한다.

**수락 기준**: 더미 데이터 기준 상태별 카운트 합이 전체 인원과 일치하게 표시된다. → Playwright로 게스트 2명 추가 후 확정 4명/총 7명으로 즉시 반영 확인.

#### Task 011: 카풀 페이지 UI 구현

- [ ] 운전자 등록 폼 UI (출발지/좌석수)
- [ ] 탑승 희망자 등록 폼 UI (희망 출발지)
- [ ] 등록 목록 조회 UI (운전/탑승 구분 표시)
- [ ] 좌석 마감 시 "모집완료" 배지 UI

**수락 기준**: 좌석 잔여/마감 두 케이스가 더미 데이터로 구분되어 표시된다.

#### Task 012: 정산 페이지 UI 구현

- [ ] 비용 항목 등록 폼 UI (주최자 전용)
- [ ] 참석 확정 인원 기준 N빵 계산 결과 표시 UI (더미 계산값)
- [ ] 금액 수동 조정 UI (주최자 전용)
- [ ] 참여자별 완납/미납 상태 배지 및 "송금 완료 체크" 버튼 UI
- [ ] 주최자 전용 "최종 확인" 버튼 UI

**수락 기준**: 완납/미납 비율이 더미 데이터에서 한눈에 구분되고, 주최자/멤버 뷰 차이가 UI상 명확하다.

---

### Phase 3: 핵심 기능 구현

Phase 3의 첫 작업(Task 013)으로 모임 매니저 도메인의 데이터베이스 스키마 마이그레이션을 작성하고, 이후 Task들은 이 스키마를 기반으로 Phase 2의 더미 데이터를 Supabase 실제 데이터 연동으로 교체하며 RSVP/카풀/정산 등 핵심 비즈니스 로직을 구현한다. API/비즈니스 로직 구현 Task는 Playwright MCP E2E 테스트를 필수로 수행한다.

#### Task 013: 모임 매니저 데이터베이스 스키마 마이그레이션 작성

- [ ] `supabase/migrations/` 에 `groups` 테이블 마이그레이션 작성 (owner_id → profiles.id, name, category, description, capacity, recurrence_rule, invite_code)
- [ ] `group_members` 테이블 작성 (group_id, user_id, role) — (group_id, user_id) unique 제약
- [ ] `events` 테이블 작성 (group_id, scheduled_at, location, capacity, 회차별 취소/휴강 표시 필드)
- [ ] `announcements` 테이블 작성 (group_id nullable, event_id nullable, content, is_pinned) — 최소 하나는 not null이 되도록 check 제약
- [ ] `rsvps` 테이블 작성 (event_id, user_id, status) — (event_id, user_id) unique 제약
- [ ] `carpool_entries` 테이블 작성 (event_id, user_id, type, location, seats)
- [ ] `expenses` 테이블 작성 (event_id, title, amount)
- [ ] `expense_shares` 테이블 작성 (expense_id, user_id, share_amount, is_paid)
- [ ] 모든 테이블 RLS 활성화 + 기본 정책(그룹 멤버만 select 가능) 골격 작성 — 세부 write 정책은 Phase 3에서 기능별로 보강
- [ ] 새 트리거 함수를 만들 경우 기존 `profiles` 패턴과 동일하게 `search_path = ''` 고정, public 실행 권한 revoke 유지
- [ ] 마이그레이션 적용 후 `mcp__supabase__generate_typescript_types`로 `lib/supabase/database.types.ts` 재생성

**수락 기준**: `mcp__supabase__list_tables`로 8개 테이블 존재 확인, `mcp__supabase__get_advisors`에서 RLS 미비 등 critical 경고 없음.

#### Task 014: 모임 생성 및 반복 일정 자동 생성 로직 구현 (F001)

- [ ] 모임 생성 Server Action 구현 — `groups` insert + 생성자 `group_members`에 role `owner`로 자동 등록
- [ ] 반복 규칙(매주/격주/매월) 파싱 후 `events` 다건 자동 생성 로직 구현
- [ ] Zod 스키마로 서버 측 입력 검증
- [ ] 성공 시 모임 상세 페이지로 리다이렉트

**테스트 체크리스트 (Playwright MCP)**

- [ ] 모임 생성 폼 제출 → 모임 상세 페이지 자동 이동 확인
- [ ] 반복 규칙에 따라 생성된 회차 개수/일자가 화면에 정확히 노출되는지 확인
- [ ] 필수값 누락 시 에러 메시지 노출 확인

#### Task 015: 회차 개별 수정 기능 구현 (F001 세부)

- [ ] 회차 수정 Server Action 구현 (일시/장소/정원/휴강 처리)
- [ ] 주최자만 수정 가능하도록 RLS/서버 측 권한 검증
- [ ] 수정 후 회차 상세·모임 상세 페이지 즉시 반영

**테스트 체크리스트 (Playwright MCP)**

- [ ] 주최자 계정으로 회차 정보 수정 → 변경 사항 즉시 반영 확인
- [ ] 일반 멤버 계정으로 접근 시 수정 UI 미노출/차단 확인

#### Task 016: 초대 링크 발급 및 합류 처리 구현 (F002)

- [ ] 모임별 고유 `invite_code` 발급 로직 (Route Handler 또는 Server Action)
- [ ] `/invite/[code]` 접근 시 비로그인이면 로그인/회원가입 경유 후 원래 초대 페이지로 복귀하는 흐름 구현
- [ ] "모임 합류하기" 클릭 시 `group_members`에 role `member`로 insert (중복 합류 방지)
- [ ] 유효하지 않거나 만료된 코드에 대한 에러 처리

**테스트 체크리스트 (Playwright MCP)**

- [ ] 비로그인 상태로 초대 링크 접근 → 로그인 후 초대 합류 페이지로 복귀 확인
- [ ] 합류 완료 → 모임 상세 페이지 자동 이동 및 멤버 목록 반영 확인
- [ ] 이미 합류한 사용자가 같은 링크 재접근 시 중복 가입되지 않는지 확인

#### Task 017: 공지 작성/조회 기능 구현 (F003)

- [ ] 모임/회차 단위 공지 작성 Server Action 구현 (주최자 권한 검증)
- [ ] 상단 고정(`is_pinned`) 토글 로직 구현
- [ ] 최신순 정렬 + 고정 공지 우선 노출 쿼리 구현

**테스트 체크리스트 (Playwright MCP)**

- [ ] 공지 작성 후 목록 최상단(또는 고정 영역) 반영 확인
- [ ] 고정 공지와 일반 공지 정렬 순서 확인

#### Task 018: RSVP 및 대기열 자동 승격 기능 구현 (F004)

- [ ] RSVP 등록/변경 Server Action 구현 (참석/불참/미정)
- [ ] 정원 초과 시 자동으로 `waitlisted` 상태 부여
- [ ] 참석 취소 발생 시 대기 1순위를 자동으로 `attending`으로 승격하는 로직 구현 (트랜잭션/동시성 고려)

**테스트 체크리스트 (Playwright MCP)**

- [ ] 정원까지 참석 등록 후 추가 참석 시도 → 대기열 등록 확인
- [ ] 기존 참석자 취소 → 대기 1순위 자동 승격 확인
- [ ] 동일 회차에 중복 RSVP 제출 시 최신 상태로만 반영되는지 확인

#### Task 019: 참여자 명단 및 게스트 관리 기능 구현 (F005)

- [ ] 회차별 확정/대기/불참 명단 실데이터 조회 구현
- [ ] 비회원 게스트 동반 등록 기능 구현 (게스트 수/이름 기록)
- [ ] 주최자 전용 접근 제어 (RLS + 페이지 가드)

**테스트 체크리스트 (Playwright MCP)**

- [ ] 주최자 계정으로 참여자 관리 페이지 접근 및 상태별 카운트 정확성 확인
- [ ] 게스트 추가 후 명단에 즉시 반영 확인
- [ ] 일반 멤버 계정의 접근 차단 확인

#### Task 020: 카풀 등록 및 목록 조회 기능 구현 (F006)

- [ ] 운전자/탑승 희망자 등록 Server Action 구현
- [ ] 좌석 수 대비 등록 인원 계산 후 마감 시 "모집완료" 자동 표시
- [ ] 등록 목록 실데이터 조회 및 정렬

**테스트 체크리스트 (Playwright MCP)**

- [ ] 운전자/탑승 희망자 등록 후 목록에 즉시 반영 확인
- [ ] 좌석 마감 조건 도달 시 모집완료 배지 노출 확인

#### Task 021: 비용 항목 등록 및 N빵 자동 계산 구현 (F007)

- [ ] 비용 항목 등록 Server Action 구현 (주최자 권한)
- [ ] 참석 확정(`attending`) 인원 기준 `expense_shares` 자동 분배 계산 로직 구현
- [ ] 금액 수동 조정 기능 구현 (합계 정합성 검증 포함)

**테스트 체크리스트 (Playwright MCP)**

- [ ] 비용 항목 등록 후 참석 인원 기준 분담액 자동 계산 확인
- [ ] 금액 수동 조정 후 합계가 총액과 일치하는지 확인

#### Task 022: 정산 상태 관리(완납 체크/최종 확인) 구현 (F008)

- [ ] 참여자 본인 송금 완료 체크(`is_paid`) Server Action 구현 (본인 행만 수정 가능하도록 RLS)
- [ ] 주최자 최종 확인 처리 로직 구현
- [ ] 완납/미납 현황 실데이터 반영

**테스트 체크리스트 (Playwright MCP)**

- [ ] 참여자 계정으로 송금 완료 체크 → 상태 즉시 반영 확인
- [ ] 타인의 분담액을 수정 시도 시 차단되는지 확인
- [ ] 주최자 최종 확인 처리 후 상태 변경 확인

#### Task 023: 홈 페이지 실데이터 연동 (F011)

- [ ] 로그인 사용자의 `group_members` 기준 소속 모임 목록 실데이터 조회
- [ ] 모임별 다음 회차 일정 실데이터 조회 및 정렬
- [ ] 더미 데이터 제거 및 로딩/빈 상태 처리

**테스트 체크리스트 (Playwright MCP)**

- [ ] 로그인 → 홈 페이지에서 실제 소속 모임과 다음 회차가 정확히 노출되는지 확인
- [ ] 소속 모임이 없는 신규 계정에서 빈 상태 UI 노출 확인

#### Task 024: 권한/RLS 정책 최종 점검 및 주최자·멤버 권한 분기 구현

- [ ] 전체 테이블 RLS 정책을 기능별 실제 요구사항에 맞게 보강 (owner만 write 가능한 리소스 재점검)
- [ ] `mcp__supabase__get_advisors`로 보안 advisor 경고 재확인 및 해소
- [ ] 프런트엔드 조건부 렌더링(주최자 전용 버튼/탭)과 서버 측 권한 검증 이중 확인

**테스트 체크리스트 (Playwright MCP)**

- [ ] 일반 멤버 계정으로 주최자 전용 액션(URL 직접 접근 포함) 시도 시 차단 확인
- [ ] 주최자 계정에서 전 기능 정상 접근 확인

---

### Phase 4: 고급 기능 및 최적화

#### Task 025: 대기열 승격 동시성 및 데이터 정합성 강화

- [ ] 동시 다발적 RSVP 취소/승격 상황에서의 race condition 점검 및 보강 (DB 트랜잭션/락 전략)
- [ ] 정원·대기열 관련 엣지케이스(정원 0, 동시 취소 다건) 처리

**테스트 체크리스트 (Playwright MCP)**

- [ ] 연속적인 취소/승격 시나리오에서 대기 순번이 꼬이지 않는지 확인

#### Task 026: 정산 금액 엣지케이스 및 단수 처리 개선

- [ ] N빵 계산 시 나눗셈 단수(원 단위 반올림) 처리 규칙 정립 및 구현
- [ ] 참석자 변경(취소/승격) 이후 기존 정산 항목과의 정합성 처리 방안 구현

**테스트 체크리스트 (Playwright MCP)**

- [ ] 나누어떨어지지 않는 금액의 분배 합이 총액과 일치하는지 확인

#### Task 027: 성능 최적화

- [ ] 모임/회차/정산 목록 쿼리에 대한 N+1 여부 점검 및 개선
- [ ] 서버 컴포넌트 데이터 페칭 캐싱 전략 적용
- [ ] 페이지별 로딩 상태(loading.tsx)/스켈레톤 UI 보강

#### Task 028: 접근성 및 반응형 최종 QA

- [ ] 전 페이지 키보드 내비게이션 및 스크린리더 라벨 점검
- [ ] 모바일/태블릿/데스크톱 breakpoint 최종 점검

#### Task 029: E2E 테스트 코드 정비

- [ ] 핵심 사용자 여정(로그인 → 모임 생성 → 초대 합류 → RSVP → 카풀 → 정산)에 대한 Playwright 테스트 스위트 정리
- [ ] CI(`ci.yml`)에 E2E 테스트 실행 단계 추가 검토

#### Task 030: 배포 파이프라인 점검 및 프로덕션 배포 준비

- [ ] Vercel 배포 환경 변수(Supabase URL/키) 점검
- [ ] `npm run check-all` 기준 프로덕션 빌드 최종 검증
- [ ] 배포 후 스모크 테스트 체크리스트 작성 및 실행
