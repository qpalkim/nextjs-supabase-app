"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

/**
 * 초대 합류 버튼. 클릭 시 로컬 상태로 합류 완료 문구로 전환한다.
 * 실제 group_members insert는 Phase 3 Task 016에서 구현된다.
 */
export function JoinGroupButton() {
  const [isJoined, setIsJoined] = useState(false);

  if (isJoined) {
    return (
      <p className="text-foreground text-sm font-medium">
        모임에 합류했습니다!
      </p>
    );
  }

  return (
    <Button className="w-full" onClick={() => setIsJoined(true)}>
      모임 합류하기
    </Button>
  );
}
