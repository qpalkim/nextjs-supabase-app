import { Suspense } from "react";

/**
 * 초대 합류 페이지. (main)/groups 레이아웃 트리 밖 독립 세그먼트라 공통 nav가 노출되지 않는다.
 * Phase 3 Task 016에서 비로그인 시 로그인 경유 후 복귀하는 흐름을 구현한다.
 */
export default function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-5">
      <h1 className="text-2xl font-bold">모임 초대</h1>
      <Suspense
        fallback={<p className="text-muted-foreground">불러오는 중...</p>}
      >
        <InviteCode params={params} />
      </Suspense>
    </main>
  );
}

/**
 * code(런타임 params) 접근을 Suspense 경계 안으로 밀어 넣어
 * 나머지 셸은 정적으로 프리렌더되도록 분리한 컴포넌트.
 */
async function InviteCode({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  return <p className="text-muted-foreground">준비 중입니다. (코드: {code})</p>;
}
