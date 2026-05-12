// ============================================
// Todo 컨트롤러
// ============================================

import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema.js';

// ---------------- Create ----------------

export const createTodo = async (req, res) => {
  try {
    // ✏️ TODO-2: 아래 ___ 를 채우세요.
    //   req.body 를 schema 로 검증하고 깨끗한 데이터를 돌려주는 Zod 메서드 이름은?
    //   (parse / validate / check 중 — 실패 시 z.ZodError 를 throw 합니다)
    const data = createTodoSchema.___(req.body);              // ← TODO-2
    const todo = await prisma.todo.create({ data });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    // ✏️ TODO-3: 아래 ___ 를 채우세요.
    //   Zod 가 검증 실패 시 던지는 에러 클래스 이름은? (`z.???`)
    if (error instanceof z.___) {                             // ← TODO-3
      // ✏️ TODO-4: 아래 ___ 를 채우세요.
      //   ZodError 객체에서 "필드별 실패 상세 배열" 이 담긴 속성 이름은?
      //   (errors / issues / details 중 — 위 import 한 z 의 ZodError 문서 참고)
      return res.status(400).json({
        success: false,
        errors: error.___.map((err) => ({                     // ← TODO-4
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
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
    // ✏️ TODO-2: 위와 같은 답을 채우세요.
    const data = updateTodoSchema.___(req.body);              // ← TODO-2 (같은 답)
    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data
    });
    res.json({ success: true, data: todo });
  } catch (error) {
    // ✏️ TODO-3: 위와 같은 답을 채우세요.
    if (error instanceof z.___) {                             // ← TODO-3 (같은 답)
      // ✏️ TODO-4: 위와 같은 답을 채우세요.
      return res.status(400).json({
        success: false,
        errors: error.___.map((err) => ({                     // ← TODO-4 (같은 답)
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
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
