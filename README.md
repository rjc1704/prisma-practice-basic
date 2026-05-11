# reference — 전체 정답 (완성본)

> 🎓 **챕터 1~10 + [3] 관계 챕터 1 (User-Todo 1:N)** 까지의 정답이 들어 있어요.
> 막힐 때 비교용으로 참고하세요. ([3] 관계의 N:M, 1:1, onDelete, 트랜잭션 등은 후속 실습 브랜치에서 누적됩니다.)

## 🎯 이 브랜치가 다루는 것

- ✅ User + Todo 모델 + **User ↔ Todo 1:N 관계** (`todos[]` / `userId` / `@relation(...)`)
- ✅ 시드 (사용자 2명 + 정해진 Todo 4개 + faker 30개 — 모든 Todo 에 `userId` 부여)
- ✅ Todo CRUD 6개 (create / getAll / getOne / update / upsert / delete)
- ✅ 쿼리 파라미터 — `isDone` / `search` / `sort` / `page` / `limit`
- ✅ Zod 스키마 + `validate` 미들웨어 (createTodoSchema 에 `userId` 필수 포함)
- ✅ `asyncHandler` 안에서 모든 에러 종류별 처리 (Zod / Prisma / AppError / 그 외)
- ✅ `GET /users/:userId/todos` — 특정 사용자의 Todo 목록

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

---

## 💡 학생용 브랜치로 돌아가기

```bash
git checkout practice-7   # 마지막 실습 브랜치 (User-Todo 1:N)
git checkout practice-1   # 처음부터
```
