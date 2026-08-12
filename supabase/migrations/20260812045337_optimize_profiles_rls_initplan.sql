-- profiles RLS 정책의 auth.uid() 호출을 (select auth.uid())로 감싸 initplan 캐싱을 적용한다.
-- 참고: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
-- 기존 auth.uid() 호출은 행마다 재평가되어 대량 조회 시 성능 저하를 유발한다는
-- Supabase 어드바이저(auth_rls_initplan) 경고를 해소한다. 정책의 의미(본인 행만 접근)는 동일하다.
alter policy "profiles_select_own"
  on public.profiles
  using ((select auth.uid()) = id);

alter policy "profiles_update_own"
  on public.profiles
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
