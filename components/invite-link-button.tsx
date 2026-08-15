"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InviteLinkButtonProps {
  inviteCode: string;
}

/**
 * 주최자 전용 초대 링크 발급 버튼. 클릭 시 다이얼로그로 초대 코드/링크를 보여준다.
 * 실제 발급(코드 갱신)은 Phase 3 Task 016에서 구현되며, 여기서는 더미 코드만 표시한다.
 */
export function InviteLinkButton({ inviteCode }: InviteLinkButtonProps) {
  const inviteUrl = `https://example.com/invite/${inviteCode}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">초대 링크 발급</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>초대 링크</DialogTitle>
          <DialogDescription>
            아래 코드 또는 링크를 공유하면 새 멤버가 모임에 합류할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 text-sm">
          <p>
            초대 코드:{" "}
            <span className="font-mono font-semibold">{inviteCode}</span>
          </p>
          <p className="text-muted-foreground break-all">{inviteUrl}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
