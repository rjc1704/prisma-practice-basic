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

// ---------------- 관계 조회 (include / select / some) ----------------

export const getTodoWithRelations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.findUnique({
    where: { id: parseInt(id) },
    include: { user: true, tags: true }
  });
  if (!todo) throw new NotFoundError('Todo를 찾을 수 없습니다');
  res.json({ success: true, data: todo });
});

export const getTodosByTag = asyncHandler(async (req, res) => {
  const { name } = req.params;
  const todos = await prisma.todo.findMany({
    where: { tags: { some: { name } } },
    include: { tags: true }
  });
  res.json({ success: true, count: todos.length, data: todos });
});

export const getTodosLite = asyncHandler(async (req, res) => {
  const todos = await prisma.todo.findMany({
    select: { id: true, title: true, isDone: true }
  });
  res.json({ success: true, count: todos.length, data: todos });
});

// ---------------- Todo 에 Tag 추가 (connectOrCreate) ----------------

export const addTagToTodo = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { name } = req.body;

  const todo = await prisma.todo.update({
    where: { id: parseInt(todoId) },
    data: {
      tags: {
        connectOrCreate: {
          where:  { name },
          create: { name }
        }
      }
    },
    include: { tags: true }
  });

  res.status(201).json({ success: true, data: todo });
});

export const addTagsBulk = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { names } = req.body;

  const todo = await prisma.todo.update({
    where: { id: parseInt(todoId) },
    data: {
      tags: {
        connectOrCreate: names.map(name => ({
          where:  { name },
          create: { name }
        }))
      }
    },
    include: { tags: true }
  });

  res.status(201).json({ success: true, data: todo });
});

// ---------------- Tag 해제 ([3] Ch9 — disconnect / set) ----------------

// ✏️ TODO-1: Todo 에서 "특정 태그 연결만 끊기" 의 키워드는?
//   힌트: disconnect / set / deleteMany 중 — "Tag 자체는 그대로 두고 이 Todo 와의 연결만 끊기".
//          (deleteMany 는 Tag 행 자체를 지워버려요. 다른 Todo 가 쓰고 있을지도 모르는데 위험!)
export const removeTagFromTodo = asyncHandler(async (req, res) => {
  const { todoId, tagId } = req.params;

  const todo = await prisma.todo.update({
    where: { id: parseInt(todoId) },
    data: {
      tags: {
        ___: { id: parseInt(tagId) }                          // ← TODO-1
      }
    },
    include: { tags: true }
  });

  res.json({ success: true, data: todo });
});

// ✏️ TODO-2: Todo 의 태그 목록을 "통째로 교체" 하는 키워드는?
//   힌트: disconnect / set / replace 중 — "기존 연결 모두 끊고 새 목록으로 덮어쓰기".
//          프론트 편집 화면에서 "최종 선택된 태그 목록" 만 받아서 한 번에 적용할 때 가장 자주 쓰여요.
export const replaceTodoTags = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { tagIds } = req.body;   // [1, 5]

  const todo = await prisma.todo.update({
    where: { id: parseInt(todoId) },
    data: {
      tags: {
        ___: tagIds.map(id => ({ id: parseInt(id) }))         // ← TODO-2
      }
    },
    include: { tags: true }
  });

  res.json({ success: true, data: todo });
});
