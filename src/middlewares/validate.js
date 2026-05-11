// ============================================
// 검증 미들웨어
// ============================================
//
// 라우트마다 "이 스키마로 req.body 를 검증한다" 라고 선언하면,
// 미들웨어가 통과시 req.validatedData 에 깨끗한 데이터를 넣어주고
// 실패시 400 응답을 보냅니다.

import { z } from 'zod';

// ✏️ TODO-2: 아래 ___ 두 군데를 채우세요.
//   ① schema 객체에서 req.body 를 검증하는 Zod 메서드 이름은? (parse / validate / check 중)
//      (검증 실패 시 z.ZodError 를 throw 합니다)
//   ② 검증 성공 후 "다음 미들웨어로 넘기는" Express 함수 이름은?
//      (위 매개변수 (req, res, next) 중 무엇?)
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedData = schema.___(req.body);              // ← ①
      ___();                                                  // ← ②
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};
