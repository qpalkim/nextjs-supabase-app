import { Users } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { JoinGroupButton } from "@/components/join-group-button";
import type { Group } from "@/lib/types/group";

/** 초대 코드별 더미 모임 매핑. 실제 조회는 Phase 3 Task 016에서 invite_code로 대체된다. */
const DUMMY_GROUPS_BY_INVITE_CODE: Record<string, Group> = {
  SWIM123: {
    id: "g1",
    name: "월요일 아침 수영",
    category: "수영",
    description:
      "매주 월요일 아침 강남 스포츠센터에서 자유형 위주로 진행하는 모임입니다.",
    capacity: 12,
    inviteCode: "SWIM123",
    ownerId: "u1",
    createdAt: "2026-01-05T00:00:00.000Z",
  },
  RUN456: {
    id: "g2",
    name: "주말 한강 러닝",
    category: "러닝",
    description: "매주 토요일 오전 한강공원에서 5km를 함께 달리는 모임입니다.",
    capacity: 20,
    inviteCode: "RUN456",
    ownerId: "u2",
    createdAt: "2026-02-10T00:00:00.000Z",
  },
};

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
  const group = DUMMY_GROUPS_BY_INVITE_CODE[code];

  if (!group) {
    return (
      <EmptyState
        icon={Users}
        title="유효하지 않은 초대 코드입니다"
        description="링크가 만료되었거나 잘못된 코드예요. 초대한 분에게 새 링크를 요청해주세요."
        action={
          <Button asChild variant="outline">
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
        }
      />
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{group.name}</CardTitle>
        <CardDescription>{group.category}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground text-sm">{group.description}</p>
        <JoinGroupButton />
      </CardContent>
    </Card>
  );
}
