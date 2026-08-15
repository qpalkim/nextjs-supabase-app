import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EventCard } from "@/components/event-card";
import { InviteLinkButton } from "@/components/invite-link-button";
import type { Announcement } from "@/lib/types/announcement";
import type { Event } from "@/lib/types/event";
import type { GroupMemberRole } from "@/lib/types/group";

/**
 * 이 페이지에서만 쓰는 시연용 role 더미 상수. 실제 role 배선은
 * app/(main)/groups/[groupId]/layout.tsx와 마찬가지로 Phase 3 Task 024에서 이뤄진다.
 */
const CURRENT_USER_ROLE: GroupMemberRole = "owner";

const DUMMY_INVITE_CODE = "SWIM123";

const dummyAnnouncements: Announcement[] = [
  {
    id: "a1",
    groupId: "g1",
    eventId: null,
    content: "8월부터 강습 시간이 07:00로 30분 앞당겨집니다. 참고 부탁드려요.",
    isPinned: true,
    createdAt: "2026-08-01T09:00:00+09:00",
  },
  {
    id: "a2",
    groupId: "g1",
    eventId: null,
    content: "이번 달 정산은 다음 주 월요일에 마감합니다.",
    isPinned: false,
    createdAt: "2026-08-10T09:00:00+09:00",
  },
  {
    id: "a3",
    groupId: "g1",
    eventId: null,
    content: "신규 멤버 두 분을 환영합니다!",
    isPinned: false,
    createdAt: "2026-08-05T09:00:00+09:00",
  },
];

const dummyEvents: Event[] = [
  {
    id: "e1",
    groupId: "g1",
    scheduledAt: "2026-08-18T07:00:00+09:00",
    location: "강남 스포츠센터",
    capacity: 12,
    isCancelled: false,
  },
  {
    id: "e2",
    groupId: "g1",
    scheduledAt: "2026-08-25T07:00:00+09:00",
    location: "강남 스포츠센터",
    capacity: 12,
    isCancelled: false,
  },
  {
    id: "e3",
    groupId: "g1",
    scheduledAt: "2026-09-01T07:00:00+09:00",
    location: "강남 스포츠센터",
    capacity: 12,
    isCancelled: true,
  },
];

/** 고정 공지를 최상단에, 나머지는 최신순으로 정렬한다. */
function sortAnnouncements(announcements: Announcement[]): Announcement[] {
  return [...announcements].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * 모임 상세(공지·일정) 페이지. Phase 3에서 groupId 기반 실데이터로 교체된다.
 * groupId(런타임 params) 접근을 Suspense 경계 안으로 밀어 넣어 Cache Components
 * 프리렌더 차단 오류를 피한다(app/(main)/groups/[groupId]/layout.tsx의 GroupTabs와 동일 패턴).
 */
export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="text-muted-foreground">불러오는 중...</p>}
    >
      <GroupDetailContent params={params} />
    </Suspense>
  );
}

async function GroupDetailContent({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  const isOwner = CURRENT_USER_ROLE === "owner";
  const sortedAnnouncements = sortAnnouncements(dummyAnnouncements);

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">공지</h2>
          {isOwner ? <InviteLinkButton inviteCode={DUMMY_INVITE_CODE} /> : null}
        </div>
        <div className="flex flex-col gap-3">
          {sortedAnnouncements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="flex items-start justify-between gap-3 pt-6">
                <p className="text-sm">{announcement.content}</p>
                {announcement.isPinned ? (
                  <Badge className="shrink-0">고정</Badge>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">일정</h2>
        <div className="flex flex-col gap-4">
          {dummyEvents.map((event) => (
            <div key={event.id} className="flex flex-col gap-2">
              <Link href={`/groups/${groupId}/events/${event.id}`}>
                <EventCard event={event} />
              </Link>
              {isOwner ? (
                <Link
                  href={`/groups/${groupId}/events/${event.id}`}
                  className="text-muted-foreground self-end text-sm hover:underline"
                >
                  회차 수정
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
