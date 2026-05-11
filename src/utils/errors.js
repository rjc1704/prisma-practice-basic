// ============================================
// 커스텀 에러 클래스
// ============================================
//
// "throw new NotFoundError('Todo를 찾을 수 없습니다')" 처럼
// 의미가 분명한 에러를 던지면, asyncHandler 가 클래스에 담긴
// status 값을 그대로 가져다 알맞은 상태코드로 응답해 줍니다.

export class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.isOperational = true;
  }
}

// ✏️ TODO-2: 아래 ___ 를 채우세요.
//   "리소스를 찾을 수 없음" 을 의미하는 표준 HTTP 상태 코드는?
//   (위 TODO-1 의 ② 와 같은 답이에요)
export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    super(message, ___);                                     // ← TODO-2
  }
}

export class ValidationError extends AppError {
  constructor(message = '유효하지 않은 데이터입니다') {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = '이미 존재하는 데이터입니다') {
    super(message, 409);
  }
}
