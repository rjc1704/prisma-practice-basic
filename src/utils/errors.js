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

export class NotFoundError extends AppError {
  constructor(message = '리소스를 찾을 수 없습니다') {
    super(message, 404);
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
