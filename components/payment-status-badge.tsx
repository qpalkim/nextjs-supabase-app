import { Badge } from "@/components/ui/badge";

interface PaymentStatusBadgeProps {
  isPaid: boolean;
}

/** 정산 완납 여부를 색상+텍스트 라벨 배지로 표시한다. */
export function PaymentStatusBadge({ isPaid }: PaymentStatusBadgeProps) {
  return (
    <Badge variant={isPaid ? "success" : "destructive"}>
      {isPaid ? "완납" : "미납"}
    </Badge>
  );
}
