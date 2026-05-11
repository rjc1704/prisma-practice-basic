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
  getAllTags,
  getUserWithProfile,
  deleteUser,
  getTodoWithRelations,
  getTodosByTag,
  getTodosLite,
  addTagToTodo,
  addTagsBulk,
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
app.post('/todos', validate(createTodoSchema), createTodo);

// UPDATE
app.put('/todos/upsert', upsertTodo);
app.patch('/todos/:id', validate(updateTodoSchema), updateTodo);

// DELETE
app.delete('/todos/:id', deleteTodo);

// ---------------- User ↔ Todo (1:N) ----------------
app.get('/users/:userId/todos', getUserTodos);

// ---------------- Tag (N:M 검증용) ----------------
app.get('/tags', getAllTags);

// ---------------- User + Profile (1:1) ----------------
app.get('/users/:id', getUserWithProfile);
app.delete('/users/:id', deleteUser);

// ---------------- 관계 조회 (Ch5) ----------------
app.get('/todos/:id/full', getTodoWithRelations);
app.get('/todos-lite', getTodosLite);
app.get('/tags/:name/todos', getTodosByTag);

// ---------------- Todo 에 Tag 추가 (Ch7-8) ----------------
app.post('/todos/:todoId/tags', addTagToTodo);
app.post('/todos/:todoId/tags/bulk', addTagsBulk);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
