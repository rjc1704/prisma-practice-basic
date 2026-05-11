// ============================================
// Todo 컨트롤러
// ============================================

import prisma from '../lib/prisma.js';

// ---------------- Create ----------------

export const createTodo = async (req, res) => {
  try {
    const { title, content, isDone } = req.body;
    const todo = await prisma.todo.create({
      data: { title, content, isDone }
    });
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------- Read ----------------

export const getAllTodos = async (req, res) => {
  try {
    // ✏️ TODO-1: 아래 ___ 를 채우세요.
    //   sort 의 기본값은? (latest / oldest / title 중 — "최신순" 을 의미하는 키)
    const {
      isDone,
      search,
      sort  = '___',                                       // ← TODO-1
      page  = '1',
      limit = '10'
    } = req.query;


    // ✏️ TODO-2: where 조건 동적 조립 — 아래 ___ 두 군데를 채우세요.
    //   ① req.query 값은 항상 문자열. 'true' 문자열과 비교해서 boolean 으로 변환.
    //   ② title 과 content 양쪽을 모두 검색하려면 Prisma 의 어떤 키를 쓸까요? (AND / OR / NOT 중)
    const where = {};
    if (isDone !== undefined) {
      where.isDone = (isDone === '___');                   // ← ①
    }
    if (search) {
      where.___ = [                                        // ← ②
        { title:   { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }


    // ✏️ TODO-3: orderBy 동적 조립 — 아래 ___ 를 채우세요.
    //   객체 매핑: { latest: ..., oldest: ..., title: ... }[??] 로 sort 값에 해당하는 orderBy 객체를 꺼냅니다.
    //   괄호 안에 들어갈 변수 이름은 무엇일까요?
    const orderBy = {
      latest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc'  },
      title:  { title:     'asc'  }
    }[___] || { createdAt: 'desc' };                       // ← TODO-3


    // ✏️ TODO-4: 페이지네이션 — 아래 ___ 를 채우세요. (같은 함수 이름을 두 번 씁니다)
    //   문자열을 정수로 변환하는 JavaScript 내장 함수 이름은?
    const pageNum = ___(page)  || 1;                       // ← TODO-4
    const take    = ___(limit) || 10;                      // ← TODO-4 (같은 답)
    const skip    = (pageNum - 1) * take;


    // ✏️ TODO-5: Promise.all 로 목록 + 전체 개수를 병렬 조회 — ___ 두 군데를 채우세요.
    //   ① 조건에 맞는 모든 행을 배열로 가져오는 Prisma 메서드는? (practice-3 에서도 만났죠!)
    //   ② 조건에 맞는 행의 "개수" 를 세는 Prisma 메서드는?
    const [todos, total] = await Promise.all([
      prisma.todo.___({ where, orderBy, skip, take }),     // ← ①
      prisma.todo.___({ where })                            // ← ②
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
    const todo = await prisma.todo.update({
      where: { id: parseInt(id) },
      data: req.body
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
