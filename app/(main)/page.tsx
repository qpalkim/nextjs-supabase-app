import { Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { GroupCard } from "@/components/group-card";
import type { Event } from "@/lib/types/event";
import type { Group } from "@/lib/types/group";

const groupsWithNextEvent: { group: Group; nextEvent?: Event }[] = [
  {
    group: {
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
    nextEvent: {
      id: "e1",
      groupId: "g1",
      scheduledAt: "2026-08-18T07:00:00+09:00",
      location: "강남 스포츠센터",
      capacity: 12,
      isCancelled: false,
    },
  },
  {
    group: {
      id: "g2",
      name: "주말 한강 러닝",
      category: "러닝",
      description:
        "매주 토요일 오전 한강공원에서 5km를 함께 달리는 모임입니다.",
      capacity: 20,
      inviteCode: "RUN456",
      ownerId: "u2",
      createdAt: "2026-02-10T00:00:00.000Z",
    },
  },
];

/**
 * 내 모임 목록 홈. Phase 3 Task 023에서 group_members 기준 실데이터로 교체된다.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">내 모임 목록</h1>
        <Button asChild>
          <Link href="/groups/new">모임 만들기</Link>
        </Button>
      </div>

      {groupsWithNextEvent.length === 0 ? (
        <EmptyState
          icon={Users}
          title="아직 소속된 모임이 없어요"
          description="새 모임을 만들거나 초대 링크로 합류해 보세요."
          action={
            <Button asChild>
              <Link href="/groups/new">모임 만들기</Link>
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-4">
          {groupsWithNextEvent.map(({ group, nextEvent }) => (
            <GroupCard key={group.id} group={group} nextEvent={nextEvent} />
          ))}
        </div>
      )}
    </div>
  );
}
