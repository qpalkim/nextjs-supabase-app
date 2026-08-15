import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventEditDialog } from "@/components/event-edit-dialog";
import { EventRsvpSection } from "@/components/event-rsvp-section";
import type { Announcement } from "@/lib/types/announcement";
import type { Event } from "@/lib/types/event";
import type { GroupMemberRole } from "@/lib/types/group";

/**
 * 이 페이지에서만 쓰는 시연용 role 더미 상수. 실제 role 배선은
 * app/(main)/groups/[groupId]/layout.tsx와 마찬가지로 Phase 3 Task 024에서 이뤄진다.
 */
const CURRENT_USER_ROLE: GroupMemberRole = "owner";

/** 정원 초과 시나리오를 재현하기 위해 capacity보다 큰 더미 참석 인원을 설정한다. */
const DUMMY_ATTENDING_COUNT = 13;

const dummyEvent: Event = {
  id: "e1",
  groupId: "g1",
  scheduledAt: "2026-08-18T07:00:00+09:00",
  location: "강남 스포츠센터",
  capacity: 12,
  isCancelled: false,
};

const dummyEventAnnouncements: Announcement[] = [
  {
    id: "a4",
    groupId: "g1",
    eventId: "e1",
    content: "이번 회차는 레인이 2개로 축소 운영됩니다.",
    isPinned: false,
    createdAt: "2026-08-15T09:00:00+09:00",
  },
];

/**
 * 회차 상세 페이지. Phase 3에서 groupId/eventId 기반 실데이터로 교체된다.
 * params 접근을 Suspense 경계 안으로 밀어 넣어 Cache Components 프리렌더
 * 차단 오류를 피한다(app/(main)/groups/[groupId]/layout.tsx의 GroupTabs와 동일 패턴).
 */
export default function EventDetailPage({
  params,
}: {
  params: Promise<{ groupId: string; eventId: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="text-muted-foreground">불러오는 중...</p>}
    >
      <EventDetailContent params={params} />
    </Suspense>
  );
}

async function EventDetailContent({
  params,
}: {
  params: Promise<{ groupId: string; eventId: string }>;
}) {
  await params;
  const isOwner = CURRENT_USER_ROLE === "owner";

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">
            {new Date(dummyEvent.scheduledAt).toLocaleString("ko-KR", {
              month: "long",
              day: "numeric",
              weekday: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </CardTitle>
          {dummyEvent.isCancelled ? (
            <Badge variant="destructive">휴강</Badge>
          ) : null}
        </CardHeader>
        <CardContent className="text-muted-foreground flex flex-col gap-1 text-sm">
          <p>장소: {dummyEvent.location}</p>
          <p>정원: {dummyEvent.capacity}명</p>
          <p>신청 인원: {DUMMY_ATTENDING_COUNT}명</p>
        </CardContent>
      </Card>

      {dummyEventAnnouncements.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">회차 공지</h2>
          {dummyEventAnnouncements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="pt-6 text-sm">
                {announcement.content}
              </CardContent>
            </Card>
          ))}
        </section>
      ) : null}

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">참석 응답</h2>
        <EventRsvpSection
          capacity={dummyEvent.capacity}
          attendingCount={DUMMY_ATTENDING_COUNT}
        />
      </section>

      {isOwner ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold">주최자 메뉴</h2>
          <EventEditDialog event={dummyEvent} />
        </section>
      ) : null}
    </div>
  );
}
