-- handle_new_user, handle_user_email_update는 트리거 전용 함수이므로
-- PostgREST RPC(/rest/v1/rpc/...)를 통한 직접 호출을 차단한다.
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.handle_user_email_update() from anon, authenticated;
