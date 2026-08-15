import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Event } from "@/lib/types/event";
import type { Group } from "@/lib/types/group";

interface GroupCardProps {
  group: Group;
  nextEvent?: Event;
}

/** 소속 모임 1건을 요약해 보여주고 클릭 시 모임 상세로 이동하는 카드. */
export function GroupCard({ group, nextEvent }: GroupCardProps) {
  return (
    <Link href={`/groups/${group.id}`} className="block w-full">
      <Card className="hover:bg-accent/50 h-full w-full transition-colors">
        <CardHeader>
          <CardTitle>{group.name}</CardTitle>
          <CardDescription>{group.category}</CardDescription>
        </CardHeader>
        <CardContent>
          {nextEvent ? (
            <p className="text-muted-foreground text-sm">
              다음 회차:{" "}
              {new Date(nextEvent.scheduledAt).toLocaleString("ko-KR", {
                month: "long",
                day: "numeric",
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · {nextEvent.location}
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              예정된 회차가 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
