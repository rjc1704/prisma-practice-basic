# practice-5 — Zod 유효성 검사

> 📚 **교안 챕터 9** 에 해당해요.

## 🎯 이번 브랜치 목표

요청 본문이 우리가 기대한 모양인지 **컨트롤러 진입과 동시에** 검증하는 패턴을 만듭니다. **Zod 스키마 + `schema.parse(req.body)`** 조합으로 잘못된 입력은 의미 있는 400 응답으로, 통과한 입력은 깨끗한 데이터로 받아서 Prisma 에 전달해요.

> 💡 스키마 / 컨트롤러 골격이 모두 작성돼 있어요. 여러분은 **`___` 빈칸 7 군데** 만 채우면 됩니다.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ Todo CRUD 6개 + 종합 쿼리 (`getAllTodos`)
- ✅ 라우트 정상 동작

---

## ✅ TODO 체크리스트

- [ ] **먼저**: `npm install` 실행 (`package.json` 에 `zod` 가 추가됐어요)
- [ ] **TODO-1**: `src/schemas/todo.schema.js` — `updateTodoSchema` 의 Zod 메서드 이름 빈칸 1개
- [ ] **TODO-2**: `src/controllers/todo.controller.js` — `createTodo` / `updateTodo` 에서 `req.body` 를 검증하는 Zod 메서드 이름 빈칸 2개 (같은 답)
- [ ] **TODO-3**: `src/controllers/todo.controller.js` — `catch` 안에서 Zod 검증 에러 클래스 이름 빈칸 2개 (같은 답)
- [ ] **TODO-4**: `src/controllers/todo.controller.js` — ZodError 의 "필드별 실패 상세 배열" 속성 이름 빈칸 2개 (같은 답)

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

## 💡 패턴 한눈에 보기

```
컨트롤러 try 진입
   ↓
schema.parse(req.body)   ← 검증 통과: 깨끗한 데이터 반환
   ↓                       검증 실패: z.ZodError throw
Prisma 호출
   ↓
res.json(...)

catch
 ├─ error instanceof z.ZodError → 400 + 필드별 에러 배열
 ├─ error.code === 'P2025'      → 404 (Prisma 행 없음)
 └─ 그 외                        → 400 + 메시지
```

---

## 💡 막히면?

```bash
git checkout practice-6   # 다음 브랜치(에러 처리 정돈)
git checkout practice-5   # 다시 돌아오기
```
