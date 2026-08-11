// 실 테이블 마이그레이션(Phase 3 Task 013)과 필드명을 맞출 것

/** 참석 응답 상태. 정원 초과 시 waitlisted로 자동 부여된다. */
export type RsvpStatus =
  "attending" | "not_attending" | "undecided" | "waitlisted";

/** 회차 단위 참석 응답 1건. */
export interface Rsvp {
  id: string;
  eventId: string;
  userId: string;
  status: RsvpStatus;
}
