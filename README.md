# practice-15 — `$transaction` 으로 Todo + Tag 안전 복사

> 📚 **[3] 관계 챕터 11 + 12 (실습#15)** 에 해당해요. 마지막 실습 브랜치!

## 🎯 이번 브랜치 목표

**원본 Todo + 붙어 있는 태그**를 통째로 복제합니다. 단순해 보이지만 "읽고 → 쓰기" 사이에 다른 요청이 끼어들 수 있는 경쟁 조건이 숨어 있어요. **인터랙티브 트랜잭션(`$transaction` 콜백)** 으로 원자성을 보장합니다.

```
POST /todos/1/copy
  ↓ 트랜잭션 안에서
  ① 원본 Todo + tags 읽기  ─┐
  ②           ↓             │ 같은 시점에 본 데이터로
  ③ 새 Todo + tags connect ─┘ → 중간에 끼어들면 자동 롤백
```

> 💡 **왜 트랜잭션?** 1번과 2번 사이에 누군가 원본 태그를 삭제하면 connect 시 에러. 또는 원본 Todo 가 삭제되면 source 가 stale. 트랜잭션은 두 작업을 "동일한 시점에 일어난 한 묶음" 으로 만들어요 (ACID 의 **원자성 A**).

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ 관계 4종 / 모든 조회 패턴 / connect·disconnect·set / updateMany 일괄 처리
- ✅ Todo API 가 거의 완성된 상태

---

## ✅ TODO 체크리스트

> 🗂 **총 2 곳**. 모두 `copyTodo` 안.

- [ ] **TODO-1**: `prisma.___(async (tx) => {...})` 빈칸 1 (트랜잭션 메서드, `$` 가 붙어요)
- [ ] **TODO-2**: 콜백 안 `___.todo.findUnique(...)` 빈칸 1 (콜백 인자로 받은 트랜잭션 클라이언트)

---

## 🛠 실행 방법

```bash
npm run dev
```

---

## 🧪 동작 확인 (cURL)

```bash
# 1. 원본 Todo (id=1) 와 그 태그 확인
curl http://localhost:3000/todos/1/full

# 2. 복사!
curl -X POST http://localhost:3000/todos/1/copy
# → 응답에 "title": "우유 사오기 (복사본)", isDone: false, 그리고 동일한 tags 배열
```

확인:
```bash
curl http://localhost:3000/users/1/todos | grep '(복사본)'
# → "(복사본)" 이 붙은 Todo 가 새로 보이면 OK
```

존재하지 않는 id 로 시도:
```bash
curl -X POST http://localhost:3000/todos/99999/copy
# → 404 — NotFoundError 가 트랜잭션 안에서 throw 되어 전체 롤백
```

---

## 💡 `$transaction` 두 가지 방식

```js
// 1) 배열 방식 — 단순 묶음, 결과를 분해할당
const [user, todo] = await prisma.$transaction([
  prisma.user.create({ ... }),
  prisma.todo.create({ ... })
]);

// 2) 콜백 방식 (Interactive) — 이전 결과를 다음 작업에 쓸 수 있음
await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ ... });
  return tx.todo.create({ data: { ..., userId: user.id } });
});
```

**언제 어떤 걸 쓰나?**
- 작업들이 서로 독립적이고 단순 → 배열
- "읽고 → 결과로 쓰기" 흐름 → 콜백

---

## ⚠️ 콜백 안에서 prisma 와 tx 의 차이

```js
await prisma.$transaction(async (tx) => {
  await tx.todo.findUnique(...);     // ✅ 트랜잭션 안
  await prisma.todo.findUnique(...); // ❌ 트랜잭션 바깥으로 새버림 — 원자성 깨짐!
});
```

코드 리뷰 시 "콜백 안에서 prisma. 호출이 있으면 빨간불"이라고 기억해두세요.

---

## 💡 트랜잭션 옵션 (참고)

```js
await prisma.$transaction(async (tx) => { ... }, {
  maxWait: 5000,        // 트랜잭션 획득 대기 (기본 2초)
  timeout: 10000,       // 실행 제한 (기본 5초)
  isolationLevel: 'Serializable'  // 격리 수준
});
```

격리 수준은 신입 레벨에선 깊게 안 파도 됩니다. "재고 / 잔고처럼 진짜 첨예한 경합" 이 있는 도메인에서만 `Serializable` 고려.

---

## 🎉 여기까지 오신 분께

`[3] 관계` 단원의 모든 핵심 패턴을 직접 손으로 짜보셨어요:

```
[관계 설계]     1:N / N:M / 1:1 / onDelete
[관계 조작]     nested create / connect / connectOrCreate / disconnect / set
[고급 조회]     include / select / some / every / none
[일괄/안전]     updateMany / $transaction
```

다음 단계로 고려해볼 만한 주제:
- 인증/인가 (JWT, bcrypt, 권한 미들웨어)
- 테스트 (Jest, Supertest)
- 성능 (N+1 관찰, 인덱스, 캐싱)
- 배포 (`prisma migrate deploy`)

---

## 🧠 막히면?

```bash
git checkout reference   # 전체 정답
git checkout practice-15 # 복귀
```

---

## 📚 교안 참고 포인트

- **11. 트랜잭션 필요성** — "읽고-쓰기" 사이의 타이밍 문제.
- **12. `$transaction`** — 배열 방식 vs 콜백 방식. 콜백 안에선 `tx` 만!
