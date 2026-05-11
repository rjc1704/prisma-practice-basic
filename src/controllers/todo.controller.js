// ============================================
// Todo 컨트롤러
// ============================================

import prisma from '../lib/prisma.js';

// ---------------- Create ----------------

export const createTodo = async (req, res) => {
  try {
    // ✏️ TODO-4: 아래 ___ 를 채우세요.
    //   validate 미들웨어가 통과시킨 깨끗한 데이터는 req.body 가 아닌 어디에 들어있나요?
    //   (힌트: middlewares/validate.js 에서 우리가 `req.???? = ...` 형태로 저장했어요)
    const todo = await prisma.todo.create({
      data: req.___                                          // ← TODO-4
    });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------- Read ----------------

export const getAllTodos = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id) }
    });
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo를 찾을 수 없습니다' });
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Update ----------------

export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    // ✏️ TODO-4: 위와 같은 답을 채우세요.
    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: req.___                                          // ← TODO-4 (같은 답)
    });
    res.json({ success: true, data: todo });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Todo를 찾을 수 없습니다' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

export const upsertTodo = async (req, res) => {
  try {
    const { id, title, content, isDone } = req.body;
    const todo = await prisma.todo.upsert({
      where:  { id },
      update: { title, content, isDone },
      create: { title, content, isDone: isDone ?? false }
    });
    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------- Delete ----------------

export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true, message: 'Todo가 삭제되었습니다' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Todo를 찾을 수 없습니다' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
