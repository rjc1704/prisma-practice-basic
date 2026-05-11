# practice-5 — Zod 유효성 검사 + 미들웨어

> 📚 **교안 챕터 9** 에 해당해요.

## 🎯 이번 브랜치 목표

요청 본문이 우리가 기대한 모양인지 **컨트롤러 진입 전에** 검증하는 패턴을 만듭니다. **Zod 스키마 + 미들웨어** 조합으로 컨트롤러 코드를 깔끔하게 유지해요.

> 💡 스키마 / 미들웨어 / 라우트 / 컨트롤러 사용 부분의 골격이 모두 작성돼 있어요. 여러분은 **`___` 빈칸 7 군데** 만 채우면 됩니다.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ Todo CRUD 6개 + 종합 쿼리 (`getAllTodos`)
- ✅ 라우트 정상 동작

---

## ✅ TODO 체크리스트

- [ ] **먼저**: `npm install` 실행 (`package.json` 에 `zod` 가 추가됐어요)
- [ ] **TODO-1**: `src/schemas/todo.schema.js` — `updateTodoSchema` 의 Zod 메서드 이름 빈칸 1개
- [ ] **TODO-2**: `src/middlewares/validate.js` — Zod 의 검증 메서드 + Express 콜백 호출 = 빈칸 2개
- [ ] **TODO-3**: `src/server.js` — `POST /todos` 와 `PATCH /todos/:id` 앞에 검증 미들웨어 끼우기 = 빈칸 2개 (같은 답)
- [ ] **TODO-4**: `src/controllers/todo.controller.js` — `createTodo` / `updateTodo` 안의 `req.___` 채우기 = 빈칸 2개 (같은 답)

---

## 🛠 실행 방법

```bash
npm install   # zod 새로 설치
npm run dev
```

---

## 🧪 동작 확인 (cURL)

```bash
# ✅ 정상 — 통과해야 함
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"검증된 할 일","content":"내용도 잘 들어있음"}'

# ❌ 검증 실패 — title 누락
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"content":"제목이 없네"}'

# 응답 예시:
# {
#   "success": false,
#   "errors": [
#     { "field": "title", "message": "Required" }
#   ]
# }

# ❌ isDone 이 boolean 이 아님
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"테스트","isDone":"yes"}'
```

---

## 💡 왜 미들웨어로 분리하나?

```
❌ 검증 코드를 컨트롤러 안에 두면:
   - 모든 컨트롤러 첫 줄에 try/catch + Zod 검증 코드 반복
   - 비즈니스 로직이 묻혀버림

✅ 미들웨어로 분리하면:
   - 라우터 정의에서 "이 라우트는 이 스키마로 검증한다" 가 한눈에 보임
   - 컨트롤러는 검증된 데이터만 받음 → 본업에 집중
```

---

## 💡 막히면?

```bash
git checkout practice-6   # 정답 확인
git checkout practice-5   # 다시 돌아오기
```
