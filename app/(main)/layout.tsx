import { AuthButton } from "@/components/auth-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";

/**
 * 모임 매니저 도메인 전역에서 공유하는 nav/footer 셸.
 * app/protected/layout.tsx와 시각적으로 유사하지만 재작업 대상이 아닌
 * protected 데모와의 결합을 피하기 위해 독립적으로 작성한다.
 */
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex w-full flex-1 flex-col items-center gap-8">
        <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
          <div className="flex w-full max-w-md items-center justify-between gap-4 p-3 px-5 text-sm">
            <div className="flex shrink-0 items-center gap-5 whitespace-nowrap font-semibold">
              <Link href="/">모임 매니저</Link>
              <Link href="/groups/new">모임 만들기</Link>
            </div>
            {!hasEnvVars ? (
              <EnvVarWarning />
            ) : (
              <Suspense>
                <AuthButton />
              </Suspense>
            )}
          </div>
        </nav>
        <div className="flex w-full max-w-md flex-1 flex-col gap-8 p-5">
          {children}
        </div>
        <footer className="mx-auto flex w-full items-center justify-center gap-8 border-t py-8 text-center text-xs">
          <p className="text-muted-foreground">모임 매니저</p>
        </footer>
      </div>
    </main>
  );
}
