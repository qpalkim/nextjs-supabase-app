import { LogOut } from "lucide-react";

import { AdminNav } from "@/components/admin/admin-nav";

/** 관리자 전용 다크 사이드바 + 콘텐츠 영역 레이아웃. */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/30 flex min-h-screen w-full">
      <aside className="flex w-60 shrink-0 flex-col bg-slate-900 text-slate-50">
        <div className="px-6 py-6 text-lg font-bold">모임 매니저 관리자</div>
        <AdminNav />
        <div className="flex items-center gap-2 px-6 py-6 text-sm text-slate-300">
          <LogOut className="size-4" />
          로그아웃
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden p-8">{children}</main>
    </div>
  );
}
