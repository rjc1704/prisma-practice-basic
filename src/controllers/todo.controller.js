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

// ---------------- Tag 해제 (disconnect / set) ----------------

export const removeTagFromTodo = asyncHandler(async (req, res) => {
  const { todoId, tagId } = req.params;

  const todo = await prisma.todo.update({
    where: { id: parseInt(todoId) },
    data: {
      tags: {
        disconnect: { id: parseInt(tagId) }
      }
    },
    include: { tags: true }
  });

  res.json({ success: true, data: todo });
});

export const replaceTodoTags = asyncHandler(async (req, res) => {
  const { todoId } = req.params;
  const { tagIds } = req.body;

  const todo = await prisma.todo.update({
    where: { id: parseInt(todoId) },
    data: {
      tags: {
        set: tagIds.map(id => ({ id: parseInt(id) }))
      }
    },
    include: { tags: true }
  });

  res.json({ success: true, data: todo });
});

// ---------------- 일괄 처리 (updateMany) ----------------

export const completeAllTodosForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await prisma.todo.updateMany({
    where: {
      userId: parseInt(userId),
      isDone: false
    },
    data: { isDone: true }
  });
  res.json({ success: true, completedCount: result.count });
});

export const completeTodosByTag = asyncHandler(async (req, res) => {
  const { userId, tagName } = req.params;
  const result = await prisma.todo.updateMany({
    where: {
      userId: parseInt(userId),
      isDone: false,
      tags: { some: { name: tagName } }
    },
    data: { isDone: true }
  });
  res.json({ success: true, completedCount: result.count });
});

// ---------------- Todo + Tag 안전 복사 ([3] Ch11-12 — $transaction) ----------------

// ✏️ TODO-1: 원본 Todo 를 읽고 동일한 태그를 단 채로 복제합니다.
//   "읽고-쓰기" 사이에 다른 요청이 끼어들면 사고가 나죠. 두 작업을 원자적으로 묶어주는
//   Prisma 메서드는? (transaction / $transaction / batch 중)
//   힌트: $ 가 붙어 있어요. 일반 모델 메서드가 아니라 Prisma 클라이언트의 특수 메서드.
export const copyTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const copied = await prisma.___(async (tx) => {              // ← TODO-1
    // ✏️ TODO-2: 트랜잭션 범위 안에서는 일반 prisma 가 아니라 ___ 를 써야 합니다.
    //   (그래야 두 작업이 같은 트랜잭션 안에서 묶여요. 일반 prisma 로 호출하면
    //    그 작업만 트랜잭션 바깥으로 새서 원자성이 깨집니다.)
    const source = await ___.todo.findUnique({                 // ← TODO-2
      where: { id: parseInt(id) },
      include: { tags: true }
    });

    if (!source) {
      throw new NotFoundError('복사할 Todo 를 찾을 수 없습니다');
    }

    // 같은 tx 위에서 새 Todo 생성 + 동일 태그 connect
    return tx.todo.create({
      data: {
        title:   source.title + ' (복사본)',
        content: source.content,
        userId:  source.userId,
        isDone:  false,
        tags: { connect: source.tags.map(t => ({ id: t.id })) }
      },
      include: { tags: true }
    });
  });

  res.status(201).json({ success: true, data: copied });
});
