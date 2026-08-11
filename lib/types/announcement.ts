// 실 테이블 마이그레이션(Phase 3 Task 013)과 필드명을 맞출 것

/**
 * 모임 또는 회차 단위 공지. eventId가 null이면 모임 전체 공지,
 * 값이 있으면 특정 회차 공지를 의미한다.
 */
export interface Announcement {
  id: string;
  groupId: string;
  eventId: string | null;
  content: string;
  isPinned: boolean;
  createdAt: string;
}
