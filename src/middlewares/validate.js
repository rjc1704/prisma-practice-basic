// ============================================
// 검증 미들웨어
// ============================================
//
// 라우트마다 "이 스키마로 req.body 를 검증한다" 라고 선언하면,
// 미들웨어가 통과시 req.validatedData 에 깨끗한 데이터를 넣어주고
// 실패시 400 응답을 보냅니다.

import { z } from 'zod';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body);
      next();
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
