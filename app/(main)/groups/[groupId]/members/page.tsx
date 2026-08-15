"use client";

import { useState } from "react";

import { GuestAddDialog } from "@/components/guest-add-dialog";
import { RsvpStatusBadge } from "@/components/rsvp-status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Event } from "@/lib/types/event";
import type { RsvpStatus } from "@/lib/types/rsvp";

/** 참여자 명단 1건. 게스트 여부(isGuest)를 포함해 회차별로 관리한다. */
interface Participant {
  userId: string;
  name: string;
  status: RsvpStatus;
  isGuest: boolean;
}

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
];

const initialParticipantsByEventId: Record<string, Participant[]> = {
  e1: [
    { userId: "u1", name: "김주최", status: "attending", isGuest: false },
    { userId: "u2", name: "이참석", status: "attending", isGuest: false },
    { userId: "u3", name: "박대기", status: "waitlisted", isGuest: false },
    { userId: "u4", name: "최불참", status: "not_attending", isGuest: false },
    { userId: "u5", name: "정미정", status: "undecided", isGuest: false },
  ],
  e2: [
    { userId: "u1", name: "김주최", status: "attending", isGuest: false },
    { userId: "u2", name: "이참석", status: "undecided", isGuest: false },
  ],
};

const STATUS_LABELS: { status: RsvpStatus; label: string }[] = [
  { status: "attending", label: "확정" },
  { status: "waitlisted", label: "대기" },
  { status: "not_attending", label: "불참" },
  { status: "undecided", label: "미정" },
];

/**
 * 참여자 관리 페이지(주최자 전용). Phase 3에서 groupId 기반 실데이터로 교체된다.
 * 게스트 추가 시 명단에 즉시 반영해야 해 페이지 전체를 client component로 구성한다.
 *
 * 주최자가 데스크톱에서 주로 사용하는 관리 화면이라, lg 이상에서는
 * app/(main)/layout.tsx의 max-w-md 제약을 이 페이지에서만 벗어나 더 넓은
 * 폭(테이블形 명단)으로 보여준다(다른 페이지의 공통 레이아웃은 그대로 유지).
 */
export default function GroupMembersPage() {
  const [participantsByEventId, setParticipantsByEventId] = useState(
    initialParticipantsByEventId,
  );

  function handleAddGuest(
    eventId: string,
    values: { guestName: string; guestCount: number },
  ) {
    setParticipantsByEventId((prev) => {
      const guests: Participant[] = Array.from(
        { length: values.guestCount },
        (_, index) => ({
          userId: `guest-${eventId}-${Date.now()}-${index}`,
          name:
            values.guestCount > 1
              ? `${values.guestName} (${index + 1})`
              : values.guestName,
          status: "attending",
          isGuest: true,
        }),
      );
      return {
        ...prev,
        [eventId]: [...(prev[eventId] ?? []), ...guests],
      };
    });
  }

  return (
    <div className="lg:relative lg:left-1/2 lg:w-screen lg:max-w-none lg:-translate-x-1/2">
      <div className="flex flex-col gap-6 lg:mx-auto lg:max-w-4xl lg:px-8">
        <h1 className="text-2xl font-bold">참여자 관리</h1>

        <Tabs defaultValue={dummyEvents[0]?.id}>
          <TabsList>
            {dummyEvents.map((event) => (
              <TabsTrigger key={event.id} value={event.id}>
                {new Date(event.scheduledAt).toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                })}
              </TabsTrigger>
            ))}
          </TabsList>

          {dummyEvents.map((event) => {
            const participants = participantsByEventId[event.id] ?? [];
            const waitlisted = participants.filter(
              (p) => p.status === "waitlisted",
            );

            return (
              <TabsContent
                key={event.id}
                value={event.id}
                className="flex flex-col gap-4"
              >
                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                  {STATUS_LABELS.map(({ status, label }) => (
                    <span key={status}>
                      {label}{" "}
                      {participants.filter((p) => p.status === status).length}명
                    </span>
                  ))}
                  <span>총 {participants.length}명</span>
                </div>

                {/* 모바일·태블릿: 카드 목록 */}
                <div className="flex flex-col gap-2 lg:hidden">
                  {participants.map((participant) => {
                    const waitlistIndex = waitlisted.indexOf(participant);
                    return (
                      <div
                        key={participant.userId}
                        className="flex items-center justify-between gap-3 rounded-md border p-3"
                      >
                        <span className="text-sm">
                          {participant.name}
                          {participant.isGuest ? (
                            <span className="text-muted-foreground ml-1 text-xs">
                              (게스트)
                            </span>
                          ) : null}
                          {participant.status === "waitlisted" &&
                          waitlistIndex >= 0 ? (
                            <span className="text-muted-foreground ml-1 text-xs">
                              대기 {waitlistIndex + 1}번
                            </span>
                          ) : null}
                        </span>
                        <RsvpStatusBadge status={participant.status} />
                      </div>
                    );
                  })}
                </div>

                {/* 데스크톱: 테이블 목록 */}
                <div className="hidden overflow-x-auto rounded-md border lg:block">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 text-muted-foreground border-b text-left">
                      <tr>
                        <th className="px-4 py-2 font-medium">이름</th>
                        <th className="px-4 py-2 font-medium">구분</th>
                        <th className="px-4 py-2 font-medium">대기 순번</th>
                        <th className="px-4 py-2 text-right font-medium">
                          상태
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant) => {
                        const waitlistIndex = waitlisted.indexOf(participant);
                        return (
                          <tr
                            key={participant.userId}
                            className="border-b last:border-0"
                          >
                            <td className="px-4 py-2">{participant.name}</td>
                            <td className="text-muted-foreground px-4 py-2">
                              {participant.isGuest ? "게스트" : "멤버"}
                            </td>
                            <td className="text-muted-foreground px-4 py-2">
                              {participant.status === "waitlisted" &&
                              waitlistIndex >= 0
                                ? `${waitlistIndex + 1}번`
                                : "-"}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <RsvpStatusBadge status={participant.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div>
                  <GuestAddDialog
                    onAddGuest={(values) => handleAddGuest(event.id, values)}
                  />
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
