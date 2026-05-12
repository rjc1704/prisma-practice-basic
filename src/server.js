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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
