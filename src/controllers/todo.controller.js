// ============================================
// Todo 컨트롤러
// ============================================
//
// 6개의 CRUD 함수 골격은 이미 작성돼 있어요.
// 여러분은 각 함수의 `___` 빈칸을 채우면서 Prisma 의 핵심 메서드 이름을 익혀 보세요.

import prisma from '../lib/prisma.js';

// ---------------- Create ----------------

// ✏️ TODO-1: 새 행을 만드는 Prisma 메서드 이름은? (create / createMany / make 중)
export const createTodo = async (req, res) => {
  try {
    const { title, content, isDone } = req.body;

    const todo = await prisma.todo.___({                       // ← TODO-1
      data: { title, content, isDone }
    });

    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------- Read ----------------

// ✏️ TODO-2: 모든 행을 배열로 가져오는 Prisma 메서드 이름은? (findMany / findAll / getAll 중)
export const getAllTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.___();                     // ← TODO-2
    res.json({ success: true, count: todos.length, data: todos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✏️ TODO-3: 아래 ___ 두 군데를 채우세요.
//   ① unique 필드(id)로 단 1개를 찾는 Prisma 메서드 이름은? (findUnique / findOne / findById 중)
//   ② Todo 가 없을 때 응답할 HTTP 상태 코드는? ("리소스 없음" 을 의미)
export const getTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.___({                       // ← ①
      where: { id: parseInt(id) }
    });

    if (!todo) {
      return res.status(___).json({                            // ← ②
        success: false,
        message: 'Todo를 찾을 수 없습니다'
      });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ---------------- Update ----------------

// ✏️ TODO-4: 아래 ___ 두 군데를 채우세요.
//   ① 특정 행을 수정하는 Prisma 메서드 이름은? (update / patch / modify 중)
//   ② "없는 행을 수정/삭제하려 할 때" Prisma 가 던지는 에러 코드는?
//      (힌트: P 로 시작하는 4글자 코드 — 교안 6챕터 § 3. Update — (2) 실습 참고)
export const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.___({                       // ← ①
      where: { id: parseInt(id) },
      data: req.body
    });

    res.json({ success: true, data: todo });
  } catch (error) {
    if (error.code === '___') {                                // ← ②
      return res.status(404).json({ success: false, message: 'Todo를 찾을 수 없습니다' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✏️ TODO-5: "있으면 수정, 없으면 새로 생성" 하는 Prisma 메서드 이름은?
//   (update + insert 의 합성어, 영어 단어로 6글자)
export const upsertTodo = async (req, res) => {
  try {
    const { id, title, content, isDone } = req.body;

    const todo = await prisma.todo.___({                       // ← TODO-5
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

// ✏️ TODO-6: 특정 행을 삭제하는 Prisma 메서드 이름은? (delete / remove / drop 중)
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.todo.___({                                    // ← TODO-6
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
