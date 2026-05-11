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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
