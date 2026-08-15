import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/types/event";

interface EventCardProps {
  event: Event;
}

/** 회차 1건의 일시/장소/정원을 요약해 보여주고, 휴강 시 배지를 노출하는 카드. */
export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">
          {new Date(event.scheduledAt).toLocaleString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </CardTitle>
        {event.isCancelled ? <Badge variant="destructive">휴강</Badge> : null}
      </CardHeader>
      <CardContent className="text-muted-foreground space-y-1 text-sm">
        <p>장소: {event.location}</p>
        <p>정원: {event.capacity}명</p>
      </CardContent>
    </Card>
  );
}
