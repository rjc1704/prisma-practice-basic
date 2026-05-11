# practice-4 — 쿼리 파라미터 처리

> 📚 **교안 챕터 7** 에 해당해요.

## 🎯 이번 브랜치 목표

`GET /todos` 에서 **완료 여부 / 검색 / 정렬 / 페이지네이션** 을 한 번에 처리하는 종합 쿼리 컨트롤러를 만들어요.

> 💡 `getAllTodos` 의 골격(`req.query` 분해 → `where` / `orderBy` / `skip`·`take` 조립 → `Promise.all`) 은 모두 작성돼 있어요. 여러분은 **`___` 빈칸 7 군데** 만 채우면 됩니다.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ Todo CRUD 6개 컨트롤러 + 라우트 모두 동작
- ✅ Prisma `create / findMany / findUnique / update / upsert / delete` 익숙해진 상태

---

## ✅ TODO 체크리스트

`src/controllers/todo.controller.js` 의 `getAllTodos` 안에:

- [ ] **TODO-1**: `sort` 기본값 — 빈칸 1개
- [ ] **TODO-2**: `where` 조립 — `isDone` 문자열 변환 + `OR` 키워드 = 빈칸 2개
- [ ] **TODO-3**: `orderBy` 객체 매핑의 lookup 키 — 빈칸 1개
- [ ] **TODO-4**: 페이지네이션 — `___(page)` / `___(limit)` 정수 변환 함수 (같은 답 두 번) = 빈칸 2개
- [ ] **TODO-5**: `Promise.all` 안의 Prisma 메서드 — `findMany` + `count` = 빈칸 2개

---

## 🛠 실행 방법

```bash
npm run dev
```

---

## 🧪 동작 확인 (cURL)

```bash
# 모든 Todo (기본: 최신순, 10개)
curl "http://localhost:3000/todos"

# 미완료 Todo 만
curl "http://localhost:3000/todos?isDone=false"

# '공부' 검색 (title + content 양쪽)
curl "http://localhost:3000/todos?search=공부"

# 제목 오름차순 정렬
curl "http://localhost:3000/todos?sort=title"

# 페이지네이션 (2페이지, 페이지당 5개)
curl "http://localhost:3000/todos?page=2&limit=5"

# 조합 — 미완료 + '운동' 검색
curl "http://localhost:3000/todos?isDone=false&search=운동"
```

**예상 응답 형태:**
```json
{
  "success": true,
  "page": 1,
  "limit": 10,
  "total": 34,
  "totalPages": 4,
  "filters": { "isDone": "false", "search": "공부", "sort": "latest" },
  "data": [ ... ]
}
```

---

## ⚠️ 알아두면 좋은 것

- **`req.query` 값은 항상 문자열**: 그래서 `isDone === 'true'` 같은 문자열 비교 + `parseInt(page)` 같은 변환이 필요해요. (TODO-2 ①, TODO-4 가 바로 이 포인트!)
- **`Promise.all` 의 이점**: `findMany` 와 `count` 가 병렬 실행돼서 응답 속도가 거의 절반.
- **빈 `where`**: 아무 필터도 안 들어왔을 때 `where: {}` 라도 통과해야 함 → 빈 객체로 시작해서 조건부로 키 추가하는 방식 권장. (이미 그렇게 작성돼 있어요!)

---

## 💡 막히면?

```bash
git checkout practice-5   # 정답 확인
git checkout practice-4   # 다시 돌아오기
```
