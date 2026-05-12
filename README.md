# practice-7 — User ↔ Todo 1:N 관계

> 📚 **[3] 관계 챕터 1 (실습#7)** 에 해당해요.

## 🎯 이번 브랜치 목표

지금까지의 `Todo` 는 "주인"이 없었어요. 이제 **각 Todo 가 한 User 의 소유**가 되도록 1:N 관계를 정의하고, 시드와 API 도 그에 맞춰 손봅니다.

스키마에 3 줄을 추가하면 끝나는데, 그 3 줄이 1:N 관계 설계의 표준 패턴이에요.

```
User  1 ─────< N  Todo
       todos[]    userId  +  user @relation(...)
```

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ `User` / `Todo` 모델 (관계는 아직 없는 상태)
- ✅ 시드: 사용자 2명 + 정해진 Todo 4개 + faker 30개
- ✅ Todo CRUD 6개 (`create / getAll / getOne / update / upsert / delete`)
- ✅ 쿼리 파라미터 — `isDone` / `search` / `sort` / `page` / `limit`
- ✅ Zod 스키마 + 컨트롤러 안 `schema.parse(req.body)` 검증
- ✅ `asyncHandler` + 커스텀 에러 (`NotFoundError` 등) — catch 안에서 분기

---

## ✅ TODO 체크리스트

> 🗂 빈칸은 모두 `___` 로 표시돼 있고 `// ← TODO-N` 주석이 위치를 알려줘요. **총 6 곳**.

- [ ] **TODO-1**: `prisma/schema.prisma` — `User` 모델에 `todos ___[]` 가상 필드 빈칸 1
- [ ] **TODO-2**: `prisma/schema.prisma` — `Todo` 모델의 `user User @relation(fields: [___], references: [___])` 빈칸 2
- [ ] **TODO-3**: `prisma/seed.js` — 사용자 생성 시 Prisma 메서드 빈칸 2 (같은 답)
- [ ] **TODO-4**: `prisma/seed.js` — Bob 의 Todo `userId` 빈칸 1
- [ ] **TODO-5**: `src/controllers/todo.controller.js` — `getUserTodos` 의 `where: { userId: ___ }` 빈칸 1
- [ ] **TODO-6**: `src/server.js` — `/users/:userId/todos` 라우트의 컨트롤러 빈칸 1

---

## 🛠 실행 방법

> ⚠️ **DB 리셋 권장** — 이번 챕터부터 `Todo` 에 `userId NOT NULL` 이 추가돼요.
> 기존 DB 의 todos 행에는 userId 가 없어서 그대로는 마이그레이션이 실패합니다.

```bash
# 1. (TODO-1, 2 채운 뒤) DB 초기화 + 새 마이그레이션 한 번에
npx prisma migrate reset
# → 확인 프롬프트에 y 입력. 그 다음 새 마이그레이션 이름을 묻거든 빈 칸 두고 엔터 OK.

# 또는 reset 없이 새 마이그레이션만 추가하고 싶다면:
npx prisma migrate dev --name add_user_todo_relation

# 2. (TODO-3, 4 채운 뒤) 시드 재실행 (reset 으로 이미 시드가 돌았다면 생략 가능)
npm run seed

# 3. 서버 실행
npm run dev
```

---

## 🧪 동작 확인 (cURL)

```bash
# 0. 시드 확인 — Alice 의 id 와 Bob 의 id 를 알아두기
curl http://localhost:3000/todos | head -200
# → 데이터 안 userId 값을 보고 어떤 사용자가 누구인지 감 잡기.
#   (또는 Prisma Studio: npx prisma studio)

# 1. Alice 의 Todo 목록만 — TODO-6 라우트가 동작해야 응답이 옴
curl http://localhost:3000/users/1/todos

# 2. Bob 의 Todo 목록만
curl http://localhost:3000/users/2/todos

# 3. 새 Todo 생성 — userId 가 필수
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"장보기","userId":1}'

# 4. userId 누락 — Zod 가 막아야 정상 (400 응답)
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"주인 없는 할 일"}'
```

예상 응답 (TODO-6 정상 동작 시):

```json
{
  "success": true,
  "count": 3,
  "data": [
    { "id": 1, "title": "우유 사오기",    "userId": 1, "isDone": false, ... },
    { "id": 2, "title": "Prisma 공부하기", "userId": 1, "isDone": false, ... },
    { "id": 3, "title": "운동하기",        "userId": 1, "isDone": true,  ... }
  ]
}
```

---

## 💡 관계가 잘 잡혔는지 확인

```bash
# Prisma Studio 로 todos 테이블 보면 userId 컬럼이 생겨 있어야 해요.
npx prisma studio
```

> 📚 `include` 의 세부 사용법은 **다음 단계(실습#11)** 에서 본격적으로 다뤄요.
> 여기서는 "관계가 살아 있구나" 정도만 확인하면 충분합니다.

---

## 🧠 막히면?

```bash
# 다음 브랜치(practice-8)에 정답 + 다음 챕터(Todo-Tag N:M) 가 있어요.
git checkout practice-8

# 또는 reference 브랜치(전체 정답).
git checkout reference

# 다시 돌아오기
git checkout practice-7
```

---

## 📚 교안 참고 포인트

- **0. ERD 설계** — 명세 → 엔티티 → 관계. User—Todo 의 양방향 질문법.
- **1. 1:N 스키마 패턴** — 1쪽은 `Todo[]` 가상 필드 한 줄, N쪽은 `userId` + `@relation(...)` 두 줄.
- **`@relation(fields: [...], references: [...])` 해석** — "내(N쪽) 외래 키 fields 를, 부모(1쪽) references 와 연결한다."
