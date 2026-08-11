// 실 테이블 마이그레이션(Phase 3 Task 013)과 필드명을 맞출 것

/** 모임 내 멤버의 권한. owner만 모임/회차/공지/정산 등을 수정할 수 있다. */
export type GroupMemberRole = "owner" | "member";

/** 정기 모임(수영, 헬스, 러닝 등) 기본 정보. */
export interface Group {
  id: string;
  name: string;
  category: string;
  description: string;
  capacity: number;
  inviteCode: string;
  ownerId: string;
  createdAt: string;
}

/** 모임과 사용자의 가입 관계 및 권한. */
export interface GroupMember {
  groupId: string;
  userId: string;
  role: GroupMemberRole;
  joinedAt: string;
}
