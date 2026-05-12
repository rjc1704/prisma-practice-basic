// ============================================
// Express 서버 진입점
// ============================================

import express from 'express';
import dotenv from 'dotenv';
import {
  createTodo,
  getAllTodos,
  getTodo,
  getUserTodos,
  updateTodo,
  upsertTodo,
  deleteTodo
} from './controllers/todo.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Prisma Practice API Server' });
});

// READ
app.get('/todos', getAllTodos);
app.get('/todos/:id', getTodo);

// CREATE
app.post('/todos', createTodo);

// UPDATE
app.put('/todos/upsert', upsertTodo);
app.patch('/todos/:id', updateTodo);

// DELETE
app.delete('/todos/:id', deleteTodo);

// ---------------- User ↔ Todo (1:N) ----------------
// ✏️ TODO-6: "특정 사용자의 Todo 목록" 을 가져오는 라우트를 등록하세요.
//   힌트: GET 메서드 + /users/:userId/todos 경로 + getUserTodos 컨트롤러.
//         두 번째 인자 ___ 에 어떤 컨트롤러를 넣을지만 채우면 됩니다.
app.get('/users/:userId/todos', ___);                        // ← TODO-6

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
