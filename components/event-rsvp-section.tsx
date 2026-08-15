"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { RsvpStatusBadge } from "@/components/rsvp-status-badge";
import type { RsvpStatus } from "@/lib/types/rsvp";

const RSVP_OPTIONS: {
  status: Exclude<RsvpStatus, "waitlisted">;
  label: string;
}[] = [
  { status: "attending", label: "참석" },
  { status: "not_attending", label: "불참" },
  { status: "undecided", label: "미정" },
];

interface EventRsvpSectionProps {
  capacity: number;
  attendingCount: number;
}

/**
 * 회차 RSVP 버튼 그룹. 클릭 시 로컬 상태로 선택 상태를 즉시 하이라이트한다.
 * 정원 초과 시(attendingCount > capacity) 참석을 선택하면 대기열 순번을 안내한다.
 * 실제 등록/승격 로직은 Phase 3 Task 018에서 구현된다.
 */
export function EventRsvpSection({
  capacity,
  attendingCount,
}: EventRsvpSectionProps) {
  const [selectedStatus, setSelectedStatus] = useState<RsvpStatus | null>(null);
  const isFull = attendingCount >= capacity;
  const isWaitlisted = selectedStatus === "attending" && isFull;
  const waitlistPosition = attendingCount - capacity + 1;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {RSVP_OPTIONS.map((option) => (
          <Button
            key={option.status}
            type="button"
            variant={selectedStatus === option.status ? "default" : "outline"}
            onClick={() => setSelectedStatus(option.status)}
          >
            {option.label}
          </Button>
        ))}
      </div>

      {isWaitlisted ? (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <RsvpStatusBadge status="waitlisted" />
          <span>정원이 가득 차 대기 {waitlistPosition}번으로 등록됩니다.</span>
        </div>
      ) : null}
    </div>
  );
}
