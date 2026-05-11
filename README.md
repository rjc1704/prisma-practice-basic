# practice-2 — Todo 모델 + 시딩

> 📚 **교안 챕터 4, 5** 에 해당해요.

## 🎯 이번 브랜치 목표

`Todo` 모델을 정의해서 마이그레이션을 추가하고, **시드 스크립트**로 초기 데이터를 자동으로 채워 넣어 봅니다.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ `package.json`, `.env.example`, `.gitignore`
- ✅ `prisma/schema.prisma` 의 `generator client`, `datasource db`, `User` 모델
- ✅ `src/lib/prisma.js` — PrismaClient 싱글톤
- ✅ `src/server.js` — 헬스 체크 + `express.json()` 미들웨어
- ✅ 첫 마이그레이션 적용 완료

---

## ✅ TODO 체크리스트

- [ ] **TODO-1**: `prisma/schema.prisma` — `Todo` 모델 작성 (`@@map("todos")` 포함)
- [ ] **그리고**: 터미널에서 마이그레이션 실행 → `npx prisma migrate dev --name create_todos`
- [ ] **TODO-2**: `prisma/seed.js` — 정해진 Todo 4개 부분의 `___` **두 군데** 채우기 (Prisma 메서드 이름 + 마지막 항목 `isDone` 값)
- [ ] **TODO-3**: `prisma/seed.js` — 랜덤 Todo 30개 부분의 `___` **한 군데** 채우기 (`faker.datatype` 메서드 이름)
- [ ] **그리고**: `npm run seed` 실행 후 Prisma Studio 또는 DBeaver 로 데이터 확인 (총 34개)

> 💡 시드 코드의 큰 틀(`deleteMany` / `createMany` / `for` 문) 은 이미 작성돼 있어요. 여러분은 **이미 채워진 코드를 읽으면서 패턴을 익히고**, `___` **빈칸 3 곳만** 채우면 됩니다.

---

## 🛠 실행 방법

```bash
# 1. 새 의존성 설치 (package.json 에 faker 가 추가됐어요)
npm install

# 2. (TODO-1 작성 후) 마이그레이션
npx prisma migrate dev --name create_todos

# 3. (TODO-2, 3 채운 뒤) 시드 실행
npm run seed
# 또는
npx prisma db seed

# 4. 데이터 확인
npx prisma studio
```

---

## 🧪 동작 확인

```bash
# Prisma Studio 로 todos 테이블 열어서 데이터 약 34개(=4+30) 보이면 성공!
npx prisma studio
```

---

## 💡 막히면?

```bash
git checkout practice-3   # 정답 확인
git checkout practice-2   # 다시 돌아오기
```

---

## ⚠️ 자주 하는 실수

- **삭제 순서**: `seed.js` 에서 자식 테이블(`todo`) 부터 지우고 그 다음 부모(`user`) 를 지웁니다. 지금은 관계가 없지만 습관 들이세요.
- **`package.json` 의 `prisma.seed`**: `npx prisma db seed` 가 동작하려면 `package.json` 최상위에 `"prisma": { "seed": "node prisma/seed.js" }` 가 있어야 해요. (이번 브랜치엔 이미 들어있어요.)
