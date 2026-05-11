// ============================================
// Express 서버 진입점
// ============================================

import express from 'express';
import dotenv from 'dotenv';
import {
  createTodo,
  getAllTodos,
  getTodo,
  updateTodo,
  upsertTodo,
  deleteTodo
} from './controllers/todo.controller.js';
import { validate } from './middlewares/validate.js';
import { createTodoSchema, updateTodoSchema } from './schemas/todo.schema.js';

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
// ✏️ TODO-3: 아래 ___ 두 군데를 채우세요. (같은 함수 이름을 두 번 씁니다)
//   POST /todos 와 PATCH /todos/:id 앞에 검증 미들웨어를 끼우려고 합니다.
//   미들웨어 함수 이름은? (위 import 줄을 보세요)
app.post('/todos', ___(createTodoSchema), createTodo);      // ← TODO-3

// UPDATE
app.put('/todos/upsert', upsertTodo);
app.patch('/todos/:id', ___(updateTodoSchema), updateTodo); // ← TODO-3 (같은 답)

// DELETE
app.delete('/todos/:id', deleteTodo);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
