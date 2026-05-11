// ============================================
// Zod 스키마 — Todo 요청 본문 검증
// ============================================

import { z } from 'zod';

export const createTodoSchema = z.object({
  title:   z.string().min(1, 'title은 1자 이상이어야 합니다').max(100, 'title은 100자 이하여야 합니다'),
  content: z.string().max(1000, 'content는 1000자 이하여야 합니다').optional(),
  isDone:  z.boolean().optional().default(false)
});

// ✏️ TODO-1: 아래 ___ 를 채우세요.
//   PATCH 요청은 일부 필드만 보내는 경우가 많아요. createTodoSchema 의
//   모든 필드를 optional 로 만드는 Zod 메서드는 무엇일까요? (partial / optional / loose 중)
export const updateTodoSchema = createTodoSchema.___();   // ← TODO-1
