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

// ---------------- User 삭제 (Cascade) ----------------

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: parseInt(id) } });
  res.json({ success: true, message: 'User가 삭제되었습니다 (Todo / Profile 도 자동 삭제)' });
});

// ---------------- 관계 조회 ([3] Ch5 — include / select / some) ----------------

// ✏️ TODO-1: "이 Todo + 작성자(User) + 붙은 Tag 들" 을 한 번에 가져오려면?
//   힌트: include / select / fetch 중 — "관계를 통째로 끌어오는" 키워드.
export const getTodoWithRelations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(id) },
    ___: { user: true, tags: true }                          // ← TODO-1
  });
  if (!todo) throw new NotFoundError('Todo를 찾을 수 없습니다');
  res.json({ success: true, data: todo });
});

// ✏️ TODO-2: 특정 태그가 붙은 Todo 들만 조회합니다.
//   tags 관계 안에서 "하나라도 일치하면 OK" 를 의미하는 키워드는?
//   힌트: some / every / none 중. "적어도 하나" 가 some 의 영어 직역.
export const getTodosByTag = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const todos = await prisma.todo.findMany({
    where: {
      tags: { ___: { name } }                                // ← TODO-2
    },
    include: { tags: true }
  });
  res.json({ success: true, count: todos.length, data: todos });
});

// ✏️ TODO-3: 응답에 "id / title / isDone" 만 담고 싶다면?
//   힌트: select / include / pick 중 — "지정한 필드만 가져오기" 키워드.
//          (include 는 "전체 + 관계 추가", select 는 "지정한 것만").
export const getTodosLite = asyncHandler(async (req, res) => {
  const todos = await prisma.todo.findMany({
    ___: { id: true, title: true, isDone: true }             // ← TODO-3
  });
  res.json({ success: true, count: todos.length, data: todos });
});
