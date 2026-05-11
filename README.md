# practice-6 — 오류 처리 (asyncHandler + 커스텀 에러)

> 📚 **교안 챕터 10** 에 해당해요.

## 🎯 이번 브랜치 목표

**모든 컨트롤러의 `try/catch` 를 `asyncHandler` 한 곳으로 모읍니다.** 핵심 도구 2개:

1. `asyncHandler` — async 함수를 감싸 내부에서 throw 된 에러를 종류별로 처리
2. 커스텀 에러 클래스 — `throw new NotFoundError('...')` 처럼 의도 분명한 에러 던지기

> 💡 `asyncHandler` 안에 모든 에러 분기(Zod / Prisma "행 없음" / AppError / 그 외) 가 모여 있어요. 컨트롤러 6개는 이미 `asyncHandler` 로 감싸졌고 `try/catch` 가 사라진 상태입니다. 여러분은 **`___` 빈칸 4 군데** 만 채우면 됩니다.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ Zod 검증 + validate 미들웨어
- ✅ `POST /todos`, `PATCH /todos/:id` 에서 검증 동작
- ✅ 컨트롤러에서 `req.validatedData` 사용

---

## ✅ TODO 체크리스트

- [ ] **TODO-1**: `src/utils/asyncHandler.js` — Prisma 에러 코드 (`P????`) + HTTP 상태 코드 = 빈칸 2개
- [ ] **TODO-2**: `src/utils/errors.js` — `NotFoundError` 의 HTTP 상태 코드 = 빈칸 1개
- [ ] **TODO-3**: `src/controllers/todo.controller.js` — `getTodo` 의 `throw new ___(...)` 커스텀 에러 클래스 이름 = 빈칸 1개

---

## 🛠 실행 방법

```bash
npm run dev
```

---

## 🧪 동작 확인 (cURL)

```bash
# ✅ 존재하지 않는 ID — Prisma P2025 분기가 처리
curl -X PATCH http://localhost:3000/todos/99999 \
  -H "Content-Type: application/json" \
  -d '{"isDone":true}'

# 예상 응답:
# { "success": false, "message": "데이터를 찾을 수 없습니다" }

# ✅ getTodo 의 NotFoundError 분기
curl http://localhost:3000/todos/99999
# → 404 + { "success": false, "message": "Todo를 찾을 수 없습니다" }
```

---

## 💡 리팩토링 비교 (예시)

**Before (practice-5):**
```js
export const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.todo.delete({ where: { id: parseInt(id) } });
    res.json({ success: true, message: 'Todo가 삭제되었습니다' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Todo를 찾을 수 없습니다' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};
```

**After (practice-6 — 이미 적용된 모습):**
```js
export const deleteTodo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await prisma.todo.delete({ where: { id: parseInt(id) } });
  res.json({ success: true, message: 'Todo가 삭제되었습니다' });
});
// P2025 처리는 asyncHandler 안에서 알아서!
```

---

## 💡 막히면?

```bash
git checkout reference   # 완성본 정답
git checkout practice-6  # 다시 돌아오기
```

---

## 🎉 축하합니다!

이 브랜치까지 완료했다면 Prisma + Express 백엔드의 **기본 패턴 대부분을 직접 손으로 만들어 본 셈**이에요. 다음은 관계(Relations) + 트랜잭션 + 인증 + 테스트 + 배포로 확장해 봅시다!
