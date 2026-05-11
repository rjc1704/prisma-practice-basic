// ============================================
// Express 서버 진입점
// ============================================

import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// TODO-3: JSON 요청 본문을 파싱할 수 있도록 express.json() 미들웨어를 등록하세요.
//   힌트: app.use(...)


// 헬스 체크 — 서버가 살아있는지 확인하는 용도
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.get('/', (req, res) => {
  res.json({ message: 'Prisma Practice API Server' });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
