# practice-11 — 관계 조회 (include / select / some)

> 📚 **[3] 관계 챕터 5 (실습#11)** 에 해당해요.

## 🎯 이번 브랜치 목표

지금까지 `prisma.todo.findMany()` 만 했죠. 이번엔 **관계까지 함께 가져오기 / 원하는 필드만 가져오기 / 관계 조건으로 필터링** 세 가지를 익힙니다.

```
include : 관계 통째로 (SQL JOIN 처럼)
select  : 지정한 필드만 (SQL SELECT col1, col2)
where + some/every/none : 관계 안에서 조건 걸기
```

> 💡 `include` 와 `select` 는 **같이 못 써요** — 둘은 사상이 달라서 (전체+추가 vs 필요한 것만). 한 쿼리에 하나만!

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ User / Todo / Tag / Profile + 1:N / N:M / 1:1 + onDelete: Cascade
- ✅ Todo CRUD 6, `GET /users/:userId/todos`, `GET /tags`, `GET /users/:id`, `DELETE /users/:id`

---

## ✅ TODO 체크리스트

> 🗂 **총 3 곳**. 모두 `src/controllers/todo.controller.js`.

- [ ] **TODO-1**: `getTodoWithRelations` — `___: { user: true, tags: true }` 빈칸 1 (관계 함께 가져오기 키워드)
- [ ] **TODO-2**: `getTodosByTag` — `tags: { ___: { name } }` 빈칸 1 (관계 안 "하나라도 일치")
- [ ] **TODO-3**: `getTodosLite` — `___: { id: true, title: true, isDone: true }` 빈칸 1 (지정한 필드만 가져오기)

---

## 🛠 실행 방법

```bash
npm run dev
```

> ⚠️ 마이그레이션 / 시드 재실행 불필요. 이번 챕터는 컨트롤러 / 라우트만 추가.

---

## 🧪 동작 확인 (cURL)

```bash
# 1. Todo 하나 + 작성자 + 태그 모두 (include)
curl http://localhost:3000/todos/1/full
# → { ..., user: { id: 1, name: 'Alice', ... }, tags: [ { name: '집안일' } ] }

# 2. '공부' 태그가 붙은 Todo 만 (some)
curl http://localhost:3000/tags/%EA%B3%B5%EB%B6%80/todos    # URL 인코딩된 '공부'
# 또는 그냥:
curl "http://localhost:3000/tags/공부/todos"
# → { count: 1, data: [{ title: 'Prisma 공부하기', tags: [{ name: '공부' }] }] }

# 3. id / title / isDone 만 (select) — content / userId / createdAt 등 빠짐
curl http://localhost:3000/todos-lite
# → [ { id: 1, title: '우유 사오기', isDone: false }, ... ]
```

---

## 💡 include vs select 비교표

| 키워드 | 의미 | 예시 응답 차이 |
|---|---|---|
| `include` | 모든 기본 필드 + **관계 추가** | `{ id, title, content, ..., user: {...}, tags: [...] }` |
| `select`  | **지정한 것만** | `{ id, title, isDone }` (지정 안 한 건 아예 없음) |
| (둘 다 없음) | 모든 기본 필드만 | `{ id, title, content, ..., createdAt, updatedAt }` |

**언제 어떤 걸 쓰나?**
- 관리자 페이지처럼 다 보여줘야 → `include`
- 모바일/API 효율 (전송 데이터 최소화) → `select`
- 실무에서는 `select` 가 더 자주 권장됩니다.

---

## 💡 `some` / `every` / `none` 빠른 사전

| 키워드 | 의미 |
|---|---|
| `some`  | 관계 중 **하나라도** 조건 일치 |
| `every` | **모두** 조건 일치 |
| `none`  | **하나도** 일치 없음 |

```js
// "공부 태그가 붙은 Todo" — some
where: { tags: { some: { name: '공부' } } }

// "태그가 하나도 없는 Todo"
where: { tags: { none: {} } }

// "모든 태그가 'X' 인 Todo" (거의 안 씀)
where: { tags: { every: { name: 'X' } } }
```

---

## 🧠 막히면?

```bash
git checkout practice-12   # 다음 (connectOrCreate, 태그 추가 라우터)
git checkout reference     # 전체 정답
git checkout practice-11   # 복귀
```

---

## 📚 교안 참고 포인트

- **5. 관련된 객체 조회하기** — `include` / `select` / 관계 안 `where` 의 차이.
- **`some` / `every` / `none`** — N:M 필터링의 핵심 3 키워드.
