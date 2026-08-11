import type { GroupMemberRole } from "@/lib/types/group";
import Link from "next/link";
import { Suspense } from "react";

interface GroupTab {
  href: (groupId: string) => string;
  label: string;
}

/**
 * role에 따라 참여자 관리 탭 노출 여부를 결정한다.
 * 실제 role 조회는 Phase 3 Task 024에서 Supabase group_members로 연결된다.
 */
function getVisibleTabs(role: GroupMemberRole | null): GroupTab[] {
  const baseTabs: GroupTab[] = [
    { href: (groupId) => `/groups/${groupId}`, label: "공지·일정" },
    { href: (groupId) => `/groups/${groupId}/carpool`, label: "카풀" },
    { href: (groupId) => `/groups/${groupId}/settlement`, label: "정산" },
  ];
  const isOwner = role === "owner";

  return isOwner
    ? [
        ...baseTabs,
        {
          href: (groupId) => `/groups/${groupId}/members`,
          label: "참여자 관리",
        },
      ]
    : baseTabs;
}

export default function GroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ groupId: string }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Suspense
        fallback={
          <nav className="flex gap-4 overflow-x-auto border-b pb-px text-sm" />
        }
      >
        <GroupTabs params={params} />
      </Suspense>
      {children}
    </div>
  );
}

/**
 * groupId(런타임 params) 접근을 Suspense 경계 안으로 밀어 넣어
 * 나머지 셸(children 등)은 정적으로 프리렌더되도록 분리한 탭 네비게이션.
 */
async function GroupTabs({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = await params;
  const tabs = getVisibleTabs(null);

  return (
    <nav className="flex gap-4 overflow-x-auto border-b pb-px text-sm">
      {tabs.map((tab) => (
        <Link
          key={tab.label}
          href={tab.href(groupId)}
          className="whitespace-nowrap px-1 py-2 hover:underline"
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
