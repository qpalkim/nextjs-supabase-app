// 실 테이블 마이그레이션(Phase 3 Task 013)과 필드명을 맞출 것

/** 회차에 등록된 비용 항목. */
export interface Expense {
  id: string;
  eventId: string;
  title: string;
  amount: number;
}

/** 비용 항목을 참석 확정 인원 기준으로 나눈 개인별 분담분. */
export interface ExpenseShare {
  id: string;
  expenseId: string;
  userId: string;
  shareAmount: number;
  isPaid: boolean;
}
