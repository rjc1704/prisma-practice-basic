// ============================================
// asyncHandler — 컨트롤러를 감싸 try/catch 를 한 곳에 모아 줌
// ============================================

import { z } from 'zod';
import { AppError } from './errors.js';

export const asyncHandler = (fn) => {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (err) {
      // 1) Zod 검증 에러 — 컨트롤러 안 schema.parse() 가 던진 ZodError 처리
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          errors: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message
          }))
        });
      }

      // 2) Prisma — 행 없음
      if (err.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: '데이터를 찾을 수 없습니다'
        });
      }

      // 3) 커스텀 AppError (NotFoundError 등)
      if (err instanceof AppError) {
        return res.status(err.status).json({
          success: false,
          message: err.message
        });
      }

      // 4) 그 외 알 수 없는 에러
      console.error(err);
      res.status(500).json({
        success: false,
        message: '서버 에러가 발생했습니다'
      });
    }
  };
};
