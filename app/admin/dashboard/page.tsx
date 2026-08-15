import Link from "next/link";
import { Activity, Calendar, TrendingUp, Users } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface StatSummary {
  label: string;
  value: string;
  unit: string;
  diffLabel: string;
  isPositive: boolean;
  icon: typeof Calendar;
}

interface RecentEvent {
  id: string;
  title: string;
  scheduledAt: string;
  hostName: string;
  participantCount: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
}

/** 대시보드 상단 통계 카드용 더미 데이터. 실 지표 연동 전까지 사용한다. */
const dummyStats: StatSummary[] = [
  {
    label: "총 이벤트",
    value: "20",
    unit: "개",
    diffLabel: "+12% 전월 대비",
    isPositive: true,
    icon: Calendar,
  },
  {
    label: "총 사용자",
    value: "10",
    unit: "명",
    diffLabel: "+8% 전월 대비",
    isPositive: true,
    icon: Users,
  },
  {
    label: "진행 중 이벤트",
    value: "5",
    unit: "개",
    diffLabel: "-5% 전월 대비",
    isPositive: false,
    icon: Activity,
  },
  {
    label: "이번 달 신규",
    value: "10",
    unit: "개",
    diffLabel: "+15% 전월 대비",
    isPositive: true,
    icon: TrendingUp,
  },
];

const dummyRecentEvents: RecentEvent[] = [
  {
    id: "e1",
    title: "스타트업 창업자 밋업",
    scheduledAt: "2026-08-20T15:24:00+09:00",
    hostName: "정수아",
    participantCount: 7,
  },
  {
    id: "e2",
    title: "코딩 테스트 스터디",
    scheduledAt: "2026-08-17T15:24:00+09:00",
    hostName: "박준서",
    participantCount: 4,
  },
  {
    id: "e3",
    title: "주니어 개발자 취업 준비 모임",
    scheduledAt: "2026-08-25T15:24:00+09:00",
    hostName: "박준서",
    participantCount: 6,
  },
];

const dummyRecentUsers: RecentUser[] = [
  { id: "u1", name: "오서준", email: "오서준@gather.com" },
  { id: "u2", name: "한예준", email: "한예준@gather.com" },
  { id: "u3", name: "임지민", email: "임지민@gather.com" },
];

/** 날짜 문자열을 "2026년 8월 20일 오후 3:24" 형태로 표시한다. */
function formatEventDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground text-sm">
          관리자 주요 지표와 최근 활동을 확인하세요
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {dummyStats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col gap-2 pt-6">
              <div className="text-muted-foreground flex items-center justify-between text-sm">
                {stat.label}
                <stat.icon className="size-4" />
              </div>
              <p className="text-2xl font-bold">
                {stat.value}
                <span className="ml-1 text-base font-normal">{stat.unit}</span>
              </p>
              <p
                className={
                  stat.isPositive
                    ? "text-xs text-emerald-600 dark:text-emerald-400"
                    : "text-destructive text-xs"
                }
              >
                {stat.diffLabel}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">최근 이벤트</h2>
              <Link
                href="/admin/events"
                className="text-muted-foreground text-sm hover:underline"
              >
                모두 보기
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {dummyRecentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center gap-4 rounded-lg border p-3"
                >
                  <div className="bg-muted flex size-14 shrink-0 items-center justify-center rounded-md">
                    <Calendar className="text-muted-foreground size-5" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <p className="truncate text-sm font-medium">
                      {event.title}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatEventDateTime(event.scheduledAt)}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {event.hostName}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge variant="secondary">예정</Badge>
                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                      <Users className="size-3" />
                      {event.participantCount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">최근 가입 사용자</h2>
              <Link
                href="/admin/users"
                className="text-muted-foreground text-sm hover:underline"
              >
                모두 보기
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              {dummyRecentUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{user.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {user.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
