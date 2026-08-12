import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { RsvpStatus } from "@/lib/types/rsvp";

const RSVP_STATUS_MAP: Record<
  RsvpStatus,
  { label: string; variant: BadgeProps["variant"] }
> = {
  attending: { label: "참석", variant: "success" },
  not_attending: { label: "불참", variant: "destructive" },
  undecided: { label: "미정", variant: "secondary" },
  waitlisted: { label: "대기", variant: "warning" },
};

interface RsvpStatusBadgeProps {
  status: RsvpStatus;
}

/** RSVP 상태(참석/불참/미정/대기)를 색상+텍스트 라벨 배지로 표시한다. */
export function RsvpStatusBadge({ status }: RsvpStatusBadgeProps) {
  const { label, variant } = RSVP_STATUS_MAP[status];
  return <Badge variant={variant}>{label}</Badge>;
}
