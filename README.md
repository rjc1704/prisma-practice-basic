# practice-13 — `disconnect` / `set` 로 관계 해제 · 교체

> 📚 **[3] 관계 챕터 9 (실습#13)** 에 해당해요. (Ch6 Computed 필드는 심화 — 제외)

## 🎯 이번 브랜치 목표

태그를 **떼거나 통째로 갈아 끼우는** 두 가지 도구를 익힙니다.

```
[disconnect]  특정 연결 끊기 (Tag 자체는 살아 있음)
[set]         기존 연결 모두 끊고, 명시한 목록으로 통째 교체
[deleteMany]  연결 + Tag 자체까지 삭제 ← 거의 안 씁니다 (다른 Todo 가 쓸 수 있어서 위험!)
```

> 💡 **disconnect vs deleteMany 헷갈리지 마세요** — Tag 는 보통 여러 Todo 가 공유해요. "이 Todo 와만 연결을 끊기" 가 disconnect, "Tag 행 자체를 DB 에서 지우기" 가 deleteMany.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ 관계 4종 + 관계 조회 + `connectOrCreate` 로 태그 추가
- ✅ 라우트: 거의 다 (Todo CRUD, 1:N/N:M/1:1 조회, tag 추가 등)

---

## ✅ TODO 체크리스트

> 🗂 **총 2 곳**. 모두 `src/controllers/todo.controller.js`.

- [ ] **TODO-1**: `removeTagFromTodo` — `tags: { ___: { id } }` 빈칸 1 (특정 연결만 끊기)
- [ ] **TODO-2**: `replaceTodoTags` — `tags: { ___: tagIds.map(...) }` 빈칸 1 (통째 교체)

---

## 🛠 실행 방법

```bash
npm run dev
```

---

## 🧪 동작 확인 (cURL)

```bash
# 1. Todo 1 의 현재 태그 확인
curl http://localhost:3000/todos/1/full
#   → tags: [ { id: 1, name: '집안일' }, { id: 5, name: '중요' } ] 같은 모양

# 2. Tag id=1 (집안일) 만 떼기 — disconnect
curl -X DELETE http://localhost:3000/todos/1/tags/1
#   → 응답의 tags 에서 '집안일' 빠짐. 다른 Todo 의 '집안일' 은 그대로 살아 있음!

# 3. Todo 1 의 태그를 [3] (건강) 하나로 통째 교체 — set
curl -X PUT http://localhost:3000/todos/1/tags \
  -H "Content-Type: application/json" \
  -d '{"tagIds":[3]}'
#   → tags: [{ id: 3, name: '건강' }] 만 남음. 기존 연결 모두 끊김.

# 4. 빈 배열로 set — 모든 태그 연결 해제 (위험할 수 있음 — 클라이언트 validation 필수!)
curl -X PUT http://localhost:3000/todos/1/tags \
  -H "Content-Type: application/json" \
  -d '{"tagIds":[]}'
#   → tags: []
```

---

## 💡 N:M 조작 4종 비교 (Todo 의 tags 기준)

상태: `Todo(id=1) → [공부, 중요]`

| 키워드 | 동작 | 결과 |
|---|---|---|
| `connect: { id: 5 }` | 기존 유지 + 추가 | `[공부, 중요, 오늘]` |
| `disconnect: { id: 1 }` | 특정 연결만 끊기 | `[중요]` (`공부` Tag 는 DB에 살아 있음) |
| `set: [{ id: 7 }]` | 전부 끊고 새로 | `[급함]` |
| `deleteMany: ...` | 연결 + Tag 자체 삭제 | ⚠️ 다른 Todo 가 쓰는 Tag 까지 사라짐 |

---

## 💡 1:N 에서의 disconnect 는 보통 안 됨

`Todo.userId Int` (NOT NULL) 이라 disconnect 시 "FK 가 null 이 될 수 없다" 에러.
대신 **다른 사용자로 이관**(userId 직접 수정) 이 자연스러워요.

```js
// ❌ 1:N 에서 disconnect — userId 가 NOT NULL 이면 에러
await prisma.todo.update({ where: { id: 1 }, data: { user: { disconnect: true } } });

// ✅ 다른 사용자로 이관
await prisma.todo.update({ where: { id: 1 }, data: { userId: 5 } });
```

---

## 🧠 막히면?

```bash
git checkout practice-14   # 다음 (updateMany 일괄 처리)
git checkout reference     # 전체 정답
git checkout practice-13   # 복귀
```

---

## 📚 교안 참고 포인트

- **9. 관련된 객체 연결 / 연결 해제** — `connect` / `disconnect` / `set` / `deleteMany` 4종 비교.
- **`set` 의 함정** — 빈 배열도 유효한 입력. 클라이언트 검증 필수.
