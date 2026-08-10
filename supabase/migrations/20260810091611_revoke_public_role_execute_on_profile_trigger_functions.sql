-- Postgres는 함수 생성 시 기본적으로 PUBLIC 롤에 EXECUTE 권한을 부여한다.
-- anon/authenticated에서만 회수해서는 PUBLIC 상속으로 인해 여전히 호출 가능하므로 PUBLIC에서도 회수한다.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_user_email_update() from public;
