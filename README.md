# reference — 전체 정답 (완성본)

> 🎓 **챕터 1~10 + [3] 관계 챕터 1~2 (1:N + N:M)** 까지의 정답이 들어 있어요.
> 후속 챕터(1:1, onDelete, 트랜잭션 등) 는 다음 실습 브랜치에서 누적됩니다.

## 🎯 이 브랜치가 다루는 것

- ✅ User + Todo + **Tag** 모델
- ✅ User ↔ Todo **1:N** (`todos[]` / `userId` / `@relation(...)`)
- ✅ Todo ↔ Tag **N:M** (`tags[]` / `todos[]` / Prisma 자동 중간 테이블 `_TodoToTag`)
- ✅ 시드 (사용자 2 + 태그 3 + 정해진 Todo 4 with tags + faker 30)
- ✅ Todo CRUD 6 + 쿼리 파라미터 + Zod + asyncHandler
- ✅ `GET /users/:userId/todos` (1:N) / `GET /tags` (N:M 검증용)

---

## 🛠 실행 방법

```bash
# 1. 의존성 설치
npm install

# 2. .env 만들기
cp .env.example .env
# → DATABASE_URL 본인 환경에 맞게 수정

# 3. 마이그레이션 + 시드
npx prisma migrate dev
npm run seed

# 4. 서버 실행
npm run dev
```

---

## 📂 디렉터리 구조

```
prisma-practice/
├── prisma/
│   ├── schema.prisma         User + Todo 모델
│   ├── seed.js               사용자 2명 + 정해진 Todo 4개 + faker 30개
│   └── migrations/           Prisma 자동 생성
└── src/
    ├── controllers/
    │   └── todo.controller.js   6개 CRUD (asyncHandler 적용)
    ├── schemas/
    │   └── todo.schema.js       Zod create/update 스키마
    ├── middlewares/
    │   └── validate.js          Zod 검증 미들웨어
    ├── utils/
    │   ├── asyncHandler.js      모든 에러 분기 처리
    │   └── errors.js            AppError / NotFoundError 등
    ├── lib/
    │   └── prisma.js            PrismaClient 싱글톤
    └── server.js                라우트 등록
```

---

## 🧪 API 한눈에 보기

| 메서드 | 경로 | 설명 |
|---|---|---|
| GET    | `/todos`             | 전체 목록 (`isDone`, `search`, `sort`, `page`, `limit`) |
| GET    | `/todos/:id`         | 단일 조회 (없으면 404) |
| POST   | `/todos`             | 생성 (Zod 검증) |
| PUT    | `/todos/upsert`      | 있으면 수정, 없으면 생성 |
| PATCH  | `/todos/:id`         | 수정 (Zod 검증, 없으면 404) |
| DELETE | `/todos/:id`         | 삭제 (없으면 404) |
| GET    | `/users/:userId/todos` | 특정 사용자의 Todo 목록 (1:N 관계) |
| GET    | `/tags`              | 전체 태그 목록 (N:M 검증용) |

---

## 💡 학생용 브랜치로 돌아가기

```bash
git checkout practice-8   # 마지막 실습 브랜치 (Todo-Tag N:M)
git checkout practice-1   # 처음부터
```
