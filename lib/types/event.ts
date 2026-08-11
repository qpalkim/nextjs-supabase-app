// 실 테이블 마이그레이션(Phase 3 Task 013)과 필드명을 맞출 것

/** 모임의 개별 회차(일시/장소가 지정된 정기 일정 1건). */
export interface Event {
  id: string;
  groupId: string;
  scheduledAt: string;
  location: string;
  capacity: number;
  isCancelled: boolean;
}
