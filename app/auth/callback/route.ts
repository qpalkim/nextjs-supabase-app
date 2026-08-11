import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

/**
 * Google 등 OAuth 로그인 후 Supabase가 code와 함께 리다이렉트하는 콜백 라우트.
 * code를 세션으로 교환해 로그인 상태를 완료한다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/protected";

  // 사용자가 Google 동의 화면에서 거부한 경우 등, provider가 에러를 실어 보낸 케이스를 우선 처리
  if (error) {
    redirect(`/auth/error?error=${errorDescription ?? error}`);
  }

  if (code) {
    const supabase = await createClient();

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (!exchangeError) {
      redirect(next);
    } else {
      redirect(`/auth/error?error=${exchangeError.message}`);
    }
  }

  // code도 error도 없는 예상치 못한 접근
  redirect(`/auth/error?error=No code provided`);
}
