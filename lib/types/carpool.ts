// 실 테이블 마이그레이션(Phase 3 Task 013)과 필드명을 맞출 것

/** 카풀 등록 유형. 운전자 또는 탑승 희망자를 구분한다. */
export type CarpoolEntryType = "driver" | "passenger";

/** 회차별 카풀 등록 1건(운전자는 좌석 수, 탑승자는 희망 출발지 위주). */
export interface CarpoolEntry {
  id: string;
  eventId: string;
  userId: string;
  type: CarpoolEntryType;
  location: string;
  seats: number | null;
}
