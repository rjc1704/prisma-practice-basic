# practice-1 — 프로젝트 셋업 + User 모델 + 첫 마이그레이션

> 📚 **교안 챕터 1, 2, 3** 에 해당해요.

## 🎯 이번 브랜치 목표

Prisma 프로젝트를 처음부터 셋업하고, **User 모델**을 정의해서 PostgreSQL DB에 첫 마이그레이션을 적용해 봅니다.

---

## ✅ TODO 체크리스트

> 🗂 각 TODO는 코드 안에 `// TODO-N: ...` 주석으로 표시돼 있어요. 순서대로 따라가면 돼요.

- [ ] **TODO-1**: `prisma/schema.prisma` — `User` 모델 작성 (`@@map("users")` 포함)
- [ ] **TODO-2**: `src/lib/prisma.js` — PrismaClient 인스턴스 생성 후 export
- [ ] **TODO-3**: `src/server.js` — `express.json()` 미들웨어 등록
- [ ] **그리고**: `.env.example` 을 복사해서 `.env` 만들고 본인 `DATABASE_URL` 입력
- [ ] **그리고**: 터미널에서 첫 마이그레이션 실행 → `npx prisma migrate dev --name init`
- [ ] **그리고**: `npx prisma studio` 또는 DBeaver 로 `users` 테이블 생성 확인

---

## 🛠 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. .env 파일 만들기
cp .env.example .env
# → .env 를 열어서 DATABASE_URL을 본인 환경에 맞게 수정

# 3. (TODO-1, 2, 3 채운 뒤) 첫 마이그레이션
npx prisma migrate dev --name init

# 4. 서버 실행
npm run dev
```

---

## 🧪 동작 확인

```bash
# 헬스 체크
curl http://localhost:3000/health
# → {"status":"OK"}

# DB에 테이블 생겼는지 확인
npx prisma studio
# → http://localhost:5555 에서 users 테이블 확인
```

---

## 💡 막히면?

```bash
# 다음 브랜치(practice-2)에 정답이 있어요.
git checkout practice-2
# 다시 돌아오기
git checkout practice-1
```

---

## 📚 참고

- Prisma 공식 문서: https://www.prisma.io/docs
- 교안의 **1챕터(프로젝트 셋업), 2챕터(User 모델), 3챕터(마이그레이션)** 부분을 다시 읽어보면 도움이 돼요.
