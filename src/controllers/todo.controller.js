// ============================================
// Todo 컨트롤러
// ============================================
//
// 모든 컨트롤러는 asyncHandler 로 감싸져 있어 try/catch 가 필요 없어요.
// 에러는 asyncHandler 가 종류별로 알아서 처리합니다.

import prisma from '../lib/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/errors.js';

// ---------------- Create ----------------

export const createTodo = asyncHandler(async (req, res) => {
  const todo = await prisma.todo.create({
    data: req.validatedData
  });
  res.status(201).json({ success: true, data: todo });
});

// ---------------- Read ----------------

export const getAllTodos = asyncHandler(async (req, res) => {
  const {
    isDone,
    search,
    sort  = 'latest',
    page  = '1',
    limit = '10'
  } = req.query;

  const where = {};
  if (isDone !== undefined) {
    where.isDone = (isDone === 'true');
  }
  if (search) {
    where.OR = [
      { title:   { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } }
    ];
  }

  const orderBy = {
    latest: { createdAt: 'desc' },
    oldest: { createdAt: 'asc'  },
    title:  { title:     'asc'  }
  }[sort] || { createdAt: 'desc' };

  const pageNum = parseInt(page)  || 1;
  const take    = parseInt(limit) || 10;
  const skip    = (pageNum - 1) * take;

  const [todos, total] = await Promise.all([
    prisma.todo.findMany({ where, orderBy, skip, take }),
    prisma.todo.count({ where })
  ]);

  res.json({
    success: true,
    page: pageNum,
    limit: take,
    total,
    totalPages: Math.ceil(total / take),
    filters: { isDone, search, sort },
    data: todos
  });
});

export const getTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(id) }
  });
  if (!todo) throw new NotFoundError('Todo를 찾을 수 없습니다');
  res.json({ success: true, data: todo });
});

// ---------------- Update ----------------

export const updateTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data: req.validatedData
  });
  res.json({ success: true, data: todo });
});

export const upsertTodo = asyncHandler(async (req, res) => {
  const { id, title, content, isDone, userId } = req.body;
  const todo = await prisma.todo.upsert({
    where:  { id },
    update: { title, content, isDone },
    create: { title, content, isDone: isDone ?? false, userId }
  });
  res.json({ success: true, data: todo });
});

// ---------------- Delete ----------------

export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({
    where: { id: parseInt(id) }
  });
  res.json({ success: true, message: 'Todo가 삭제되었습니다' });
});

// ---------------- User ↔ Todo (1:N) ----------------

// ✏️ TODO-5: 특정 사용자의 Todo 만 골라오는 컨트롤러입니다.
//   where 안 ___ 에 들어갈 값을 채우세요.
//   힌트: req.params 의 값은 모두 "문자열"이라 그대로 쓰면 Prisma 가 타입 에러를 냅니다.
//         숫자로 바꾸는 함수가 필요해요 — parseInt(...) 또는 Number(...).
export const getUserTodos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const todos = await prisma.todo.findMany({
    where: { userId: ___ },                                  // ← TODO-5
    orderBy: { createdAt: 'desc' }
  });

  res.json({ success: true, count: todos.length, data: todos });
});
