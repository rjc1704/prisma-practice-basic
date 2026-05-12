// ============================================
// Todo 컨트롤러
// ============================================
//
// 모든 컨트롤러는 asyncHandler 로 감싸져 있어 try/catch 가 필요 없어요.
// 에러는 asyncHandler 가 종류별로 알아서 처리합니다.

import prisma from '../lib/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/errors.js';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema.js';

// ---------------- Create ----------------

export const createTodo = asyncHandler(async (req, res) => {
  const data = createTodoSchema.parse(req.body);
  const todo = await prisma.todo.create({ data });
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
  const data = updateTodoSchema.parse(req.body);
  const todo = await prisma.todo.update({
    where: { id: parseInt(id) },
    data
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

export const getUserTodos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const todos = await prisma.todo.findMany({
    where: { userId: parseInt(userId) },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ success: true, count: todos.length, data: todos });
});

// ---------------- Tag (N:M 검증용 — 학생 손댈 곳 없음) ----------------

export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' }
  });
  res.json({ success: true, count: tags.length, data: tags });
});

// ---------------- User + Profile (1:1 검증용) ----------------

export const getUserWithProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
    include: { profile: true }
  });
  if (!user) throw new NotFoundError('User를 찾을 수 없습니다');
  res.json({ success: true, data: user });
});

// ---------------- User 삭제 (Cascade 검증용) ----------------

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: parseInt(id) } });
  res.json({ success: true, message: 'User가 삭제되었습니다 (Todo / Profile 도 자동 삭제)' });
});
