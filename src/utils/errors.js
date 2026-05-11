// ============================================
// 커스텀 에러 클래스
// ============================================

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
