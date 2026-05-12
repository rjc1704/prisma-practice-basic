import { PrismaClient } from "@prisma/client";

const isProduction = process.env.NODE_ENV === "production";

const prisma = new PrismaClient({
  // 개발: 모든 쿼리 로그 → SQL 학습 + 디버깅에 유용
  // 운영: 에러만       → 로그 노이즈 ↓, 성능 영향 소
  log: isProduction ? ["error"] : ["query", "error", "warn"],
});

export default prisma;
