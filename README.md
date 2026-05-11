# practice-3 — Todo CRUD

> 📚 **교안 챕터 6** 에 해당해요. (Create / Read / Update / Delete)

## 🎯 이번 브랜치 목표

Prisma Client 의 **6개 핵심 CRUD 메서드** (`create` / `findMany` / `findUnique` / `update` / `upsert` / `delete`) 를 직접 호출해 봅니다.

> 💡 컨트롤러 함수 6개의 골격(try/catch + 응답 구조) 은 이미 작성돼 있어요. 여러분은 **`___` 빈칸 8 군데** 만 채우면서 "어떤 Prisma 메서드를 써야 하는지" 에 집중하면 됩니다. 라우트도 `server.js` 에 미리 연결돼 있어요.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ 스키마: `User`, `Todo` 모델
- ✅ 시드: 사용자 2명 + 정해진 Todo 4개 + 랜덤 30개
- ✅ Prisma Client 싱글톤, 기본 Express 서버

---

## ✅ TODO 체크리스트

`src/controllers/todo.controller.js` 에서:

- [ ] **TODO-1**: `createTodo` — `prisma.todo.___({ data })` 빈칸 1개
- [ ] **TODO-2**: `getAllTodos` — `prisma.todo.___()` 빈칸 1개
- [ ] **TODO-3**: `getTodo` — `prisma.todo.___({ where })` 빈칸 1개 + 없을 때 응답 상태 코드 빈칸 1개 = 총 2개
- [ ] **TODO-4**: `updateTodo` — `prisma.todo.___({ where, data })` 빈칸 1개 + Prisma 에러 코드 빈칸 1개 = 총 2개
- [ ] **TODO-5**: `upsertTodo` — `prisma.todo.___({ where, update, create })` 빈칸 1개
- [ ] **TODO-6**: `deleteTodo` — `prisma.todo.___({ where })` 빈칸 1개

> 💡 `server.js` 의 라우트는 이미 모두 연결돼 있어요. 컨트롤러 빈칸만 채우면 즉시 동작합니다.

---

## 🛠 실행 방법

```bash
npm run dev
```

---

## 🧪 동작 확인 (cURL 예시)

```bash
# 헬스 체크
curl http://localhost:3000/health

# 전체 조회
curl http://localhost:3000/todos

# 단일 조회
curl http://localhost:3000/todos/1

# 생성
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"테스트 할 일","content":"내가 만든 첫 Todo","isDone":false}'

# 수정 — 완료 처리
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"isDone":true}'

# Upsert — id 가 있으면 수정, 없으면 생성
curl -X PUT http://localhost:3000/todos/upsert \
  -H "Content-Type: application/json" \
  -d '{"id":999,"title":"새 할 일","content":"upsert 테스트","isDone":false}'

# 단일 삭제
curl -X DELETE http://localhost:3000/todos/1

# 존재하지 않는 ID — 404 확인
curl http://localhost:3000/todos/99999
```

---

## ⚠️ 자주 하는 실수 / 알아두면 좋은 것

- **라우트 순서**: `/todos/upsert` 가 `/todos/:id` 보다 먼저 등록돼야 합니다. 안 그러면 Express 가 `'upsert'` 를 id 로 인식해서 의도와 다른 동작을 합니다. (이번 브랜치 `server.js` 에 이미 순서대로 작성돼 있어요. 다른 프로젝트에서도 같은 패턴!)
- **`parseInt` 빠뜨림**: `req.params.id` 는 항상 문자열. Prisma 는 `where: { id: 1 }` 처럼 숫자를 기대합니다. (이미 `parseInt` 로 변환돼 있어요.)
- **P2025**: 없는 행을 update/delete 하면 Prisma 가 던지는 에러 코드. catch 에서 분기해 404 로 응답해야 합니다. (TODO-4 의 두 번째 빈칸이 바로 이것!)

---

## 💡 막히면?

```bash
git checkout practice-4   # 정답 확인
git checkout practice-3   # 다시 돌아오기
```
