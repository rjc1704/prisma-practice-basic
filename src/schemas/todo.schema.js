// ============================================
// Zod 스키마 — Todo 요청 본문 검증
// ============================================

import { z } from 'zod';

export const createTodoSchema = z.object({
  title:   z.string().min(1, 'title은 1자 이상이어야 합니다').max(100, 'title은 100자 이하여야 합니다'),
  content: z.string().max(1000, 'content는 1000자 이하여야 합니다').optional(),
  isDone:  z.boolean().optional().default(false),
  userId:  z.number().int().positive('userId는 양의 정수여야 합니다')
});

export const updateTodoSchema = createTodoSchema.partial();
