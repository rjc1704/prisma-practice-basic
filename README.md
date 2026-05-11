# practice-14 — `updateMany` 로 일괄 처리

> 📚 **[3] 관계 챕터 10 (실습#14)** 에 해당해요.

## 🎯 이번 브랜치 목표

"**오늘 할 일 모두 완료**" 같은 비즈니스 시나리오를 한 번의 SQL 로 처리합니다. 핵심은 `updateMany` 와 그 안에 들어가는 **관계 조건 결합**.

```
PATCH /users/1/todos/complete-all
  ↓ updateMany 한 번으로 Alice 의 미완료 Todo 가 한꺼번에 isDone: true
```

> ⚠️ **`where` 에 반드시 `userId` 가 들어가야 합니다.** 빼먹으면 모든 사용자의 Todo 가 일괄 완료 되는 사고가 납니다! `updateMany` / `deleteMany` 류는 코드 리뷰를 특히 꼼꼼히.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ 관계 4종 + 모든 조회 / 추가 / 해제 패턴
- ✅ 라우트: Todo CRUD, 1:N/N:M/1:1 검증, connectOrCreate, disconnect/set

---

## ✅ TODO 체크리스트

> 🗂 **총 2 곳**. 모두 `src/controllers/todo.controller.js`.

- [ ] **TODO-1**: `completeAllTodosForUser` — `prisma.todo.___({ where, data })` 빈칸 1 (여러 행 한 번에 업데이트)
- [ ] **TODO-2**: `completeTodosByTag` — `tags: { ___: { name: tagName } }` 빈칸 1 (Ch5 의 some/every/none 중)

---

## 🛠 실행 방법

```bash
npm run dev
```

---

## 🧪 동작 확인 (cURL)

```bash
# 0. Alice 의 미완료 Todo 개수 확인 (참고용)
curl "http://localhost:3000/users/1/todos" | grep -c '"isDone":false'

# 1. Alice 의 미완료 Todo 일괄 완료
curl -X PATCH http://localhost:3000/users/1/todos/complete-all
# → { "success": true, "completedCount": 7 }

# 2. 다시 한 번 호출 — 이미 다 완료라 0개
curl -X PATCH http://localhost:3000/users/1/todos/complete-all
# → { "success": true, "completedCount": 0 }

# 3. 태그별 — Alice 의 '집안일' 태그 붙은 미완료 Todo 만
curl -X PATCH http://localhost:3000/users/1/todos/complete-by-tag/집안일
```

---

## 💡 `updateMany` 안전 체크리스트

쿼리를 한 번 실행하면 N개 행을 모두 바꾸니까, 작성 시 다음을 점검하세요:

1. ✅ `where` 에 사용자 식별자 (userId 등) 가 들어 있나? — 권한 누수 방지
2. ✅ `where` 에 "이미 처리된 행 제외" 조건이 있나? (예: `isDone: false`)
3. ✅ `data` 가 한 줄짜리 변경만 하나? — 복잡하면 `update` 를 N번 도는 게 안전할 수도

`updateMany` 가 안 맞는 경우:
- 행마다 다른 값을 줘야 하는데 SQL 한 번으론 불가능 → `for` 안에서 `update` (느리지만 정확)
- 결과를 받은 행들 정보가 필요한 경우 → `updateMany` 는 `{ count }` 만 반환. 그땐 별도 `findMany` 호출.

---

## 💡 관계 조건 + updateMany 조합

이 챕터의 진짜 묘미. **5번 챕터에서 배운 `some / every / none` 이 그대로 적용** 돼요.

```js
// "집안일 태그 붙은" 미완료 Todo 일괄 완료
prisma.todo.updateMany({
  where: {
    userId: 1,
    isDone: false,
    tags: { some: { name: '집안일' } }
  },
  data: { isDone: true }
});
```

---

## 🧠 막히면?

```bash
git checkout practice-15   # 다음 (트랜잭션)
git checkout reference     # 전체 정답
git checkout practice-14   # 복귀
```

---

## 📚 교안 참고 포인트

- **10. 비즈니스 로직: 일괄 완료** — `updateMany` + 관계 조건 결합.
- **권한 분리** — `where` 에 사용자 식별자 누락 = 보안 사고.
