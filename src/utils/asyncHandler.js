// ============================================
// asyncHandler — 컨트롤러를 감싸 try/catch 를 한 곳에 모아 줌
// ============================================
//
// 사용 예시:
//   export const getTodo = asyncHandler(async (req, res) => {
//     const todo = await prisma.todo.findUnique({ where: { id: 1 } });
//     if (!todo) throw new NotFoundError('Todo를 찾을 수 없습니다');
//     res.json({ success: true, data: todo });
//   });
//
// 컨트롤러 안에서는 try/catch 안 써도 돼요! 에러는 모두 아래 catch 블록에서
// 종류별로 알맞은 응답을 보내 줍니다.

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

      // 3) 우리가 던진 커스텀 에러 (NotFoundError 등)
      //    클래스에 담아 둔 status 값을 그대로 사용
      if (err instanceof AppError) {
        return res.status(err.status).json({
          success: false,
          message: err.message
        });
      }

      // 4) 그 외 알 수 없는 에러 — 콘솔에 로그 + 500 응답
      console.error(err);
      res.status(500).json({
        success: false,
        message: '서버 에러가 발생했습니다'
      });
    }
  };
};
