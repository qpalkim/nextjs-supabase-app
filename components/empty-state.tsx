import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/** 데이터가 없을 때 아이콘/제목/설명/액션 버튼을 조합해 보여주는 범용 빈 상태 컴포넌트. */
interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-8 text-center",
        className,
      )}
    >
      {Icon ? (
        <Icon className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      ) : null}
      <p className="font-semibold text-foreground">{title}</p>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
