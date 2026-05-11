# practice-12 — `connectOrCreate` 로 Todo 에 Tag 추가

> 📚 **[3] 관계 챕터 7 + 8 (실습#12)** 에 해당해요. (Ch6 Computed 필드는 심화 자료 — 이번 브랜치에서는 제외)

## 🎯 이번 브랜치 목표

"태그를 추가하는데, **이미 있으면 그걸 쓰고 없으면 새로 만들고**" — 실무에서 가장 자주 만나는 패턴이에요. Prisma 의 `connectOrCreate` 한 줄로 끝납니다.

```
사용자가 입력한 태그 이름:
  ├─ 이미 있으면 → connect (그 행에 연결)
  └─ 없으면      → create (새로 만들고 연결)
                  ↑↑↑ 둘을 한 키워드로 합친 게 connectOrCreate
```

> 💡 왜 connectOrCreate 가 중요한가? — 순진하게 짜면 `findFirst → if-else → create/connect` 가 되는데, 그 사이 다른 요청이 같은 이름의 태그를 만들어버리면 동시성 버그가 터집니다. `connectOrCreate` 는 한 번의 SQL 로 안전하게 처리해줘요.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ 관계 4종 (1:N / N:M / 1:1 / onDelete: Cascade)
- ✅ 관계 조회 (`include`, `select`, `some`)
- ✅ 모든 검증 라우트 (`/users/:id`, `/tags`, `/todos/:id/full` 등)

---

## ✅ TODO 체크리스트

> 🗂 **총 2 곳** (같은 답, 두 번).

- [ ] **TODO-1**: `addTagToTodo` — `tags: { ___: { where, create } }` 빈칸 1
- [ ] **TODO-2**: `addTagsBulk` — `tags: { ___: names.map(...) }` 빈칸 1 (같은 답)

> 💡 TODO 가 같은 답인 이유: 두 번 손가락에 새기게 하기 위함이에요.

---

## 🛠 실행 방법

```bash
npm run dev
```

> ⚠️ 마이그레이션 / 시드 재실행 불필요.

---

## 🧪 동작 확인 (cURL)

```bash
# 1. Todo 1 에 새 태그 "중요" 추가 — 처음이라 새로 만들어짐
curl -X POST http://localhost:3000/todos/1/tags \
  -H "Content-Type: application/json" \
  -d '{"name":"중요"}'
# → 응답의 tags 배열에 "중요" 가 새로 추가됨

# 2. 같은 요청 다시 — 이번엔 이미 있어서 그냥 연결만 (안전!)
curl -X POST http://localhost:3000/todos/1/tags \
  -H "Content-Type: application/json" \
  -d '{"name":"중요"}'
# → 에러 없이 정상. tags 배열은 그대로.

# 3. 여러 태그 한 번에 — "급함" 새로 생성, "공부" 는 이미 있어서 연결
curl -X POST http://localhost:3000/todos/2/tags/bulk \
  -H "Content-Type: application/json" \
  -d '{"names":["급함","오늘","공부"]}'
```

확인해보기:
```bash
curl http://localhost:3000/todos/1/full
#   → tags 배열에 추가된 태그가 들어있는지
curl http://localhost:3000/tags
#   → 새로 만들어진 태그가 전체 목록에 보이는지
```

---

## 💡 connect / create / connectOrCreate 비교

| 키워드 | 의미 | 없는 행을 만나면? |
|---|---|---|
| `connect` | 기존 행 연결 | ❌ 에러 (Record not found) |
| `create`  | 새 행 만들기 | (해당 없음 — 항상 새로 생성) |
| `connectOrCreate` | 있으면 연결, 없으면 생성 | ✅ 자동 처리 |

**언제 어떤 걸 쓰나?**
- id 로 정확히 연결 → `connect`
- 항상 새로 만들기 (중복 키가 없는 경우) → `create`
- "사용자 입력 텍스트 → 태그/카테고리 처리" 같은 시나리오 → `connectOrCreate`

---

## 🧠 막히면?

```bash
git checkout practice-13   # 다음 (disconnect / set)
git checkout reference     # 전체 정답
git checkout practice-12   # 복귀
```

---

## 📚 교안 참고 포인트

- **7. 관련된 객체 생성/수정** — nested `create` / `connect` / `connectOrCreate`.
- **8. Todo 에 Tag 추가** — 실전 라우트 예시. 우리가 그대로 옮긴 것.
