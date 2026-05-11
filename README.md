# practice-8 — Todo ↔ Tag 다대다 (N:M) 관계

> 📚 **[3] 관계 챕터 2 (실습#8)** 에 해당해요.

## 🎯 이번 브랜치 목표

`Tag` 모델을 추가하고, **하나의 Todo 가 여러 Tag 를 가질 수 있고 하나의 Tag 도 여러 Todo 에 공용** 되도록 N:M 관계를 만듭니다.

```
Todo  N >──────< M  Tag
       tags[]      todos[]
       (외래 키 필드 없음 — Prisma 가 _TodoToTag 중간 테이블을 자동 생성!)
```

> 💡 1:N 과 비교 — 1:N 은 N쪽에 `userId` 같은 외래 키 컬럼이 보였죠. **N:M 은 양쪽에 배열 필드만 있고 외래 키가 안 보입니다.** Prisma 가 알아서 중간 테이블을 만들어 줘요.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ User / Todo 모델 + User ↔ Todo **1:N 관계** (`todos[]` / `userId` / `@relation(...)`)
- ✅ 시드: 사용자 2명 + Todo 4 + 랜덤 30 (모든 Todo 에 `userId` 부여)
- ✅ Todo CRUD 6 + 쿼리 파라미터 + Zod 검증 + asyncHandler 에러 처리
- ✅ `GET /users/:userId/todos`

---

## ✅ TODO 체크리스트

> 🗂 빈칸은 모두 `___` 로 표시돼 있고 `// ← TODO-N` 주석이 위치를 알려줘요. **총 4 곳**.

- [ ] **TODO-1**: `prisma/schema.prisma` — `Tag` 모델의 `name String ___` 빈칸 1 (중복 방지 속성)
- [ ] **TODO-2**: `prisma/schema.prisma` — `Tag` 모델의 `todos ___[]` 빈칸 1
- [ ] **TODO-3**: `prisma/schema.prisma` — `Todo` 모델의 `tags ___[]` 빈칸 1
- [ ] **TODO-4**: `prisma/seed.js` — `tags: { ___: [{ id: tagX.id }] }` 빈칸 1 (이미 있는 태그를 연결하는 키워드)

---

## 🛠 실행 방법

> ⚠️ `tags` / `_TodoToTag` 테이블이 새로 추가됩니다. 기존 데이터에는 문제 없지만 시드를 다시 돌려야 태그 데이터가 채워져요.

```bash
# 1. (TODO-1, 2, 3 채운 뒤) 마이그레이션
npx prisma migrate dev --name add_tag_n_to_n

# 2. (TODO-4 채운 뒤) 시드 재실행
npm run seed

# 3. 서버 실행
npm run dev
```

---

## 🧪 동작 확인

### 1) Prisma Studio 로 테이블 4개 확인

```bash
npx prisma studio
```

`public` 스키마 아래에 **4개 테이블** 이 보이면 성공:
- `users`
- `todos`
- `tags` ← 새로 생긴 것
- `_TodoToTag` ← Prisma 가 자동 생성한 중간 테이블

`_TodoToTag` 를 열어보면 `A`(todoId) / `B`(tagId) 두 컬럼이 있어요. 시드를 잘 채웠다면 5~6 개 행이 보일 거예요.

### 2) cURL — 태그 전체 조회

```bash
curl http://localhost:3000/tags
# → { "success": true, "count": 3, "data": [{ "name": "건강" }, { "name": "공부" }, { "name": "집안일" }] }
```

### 3) 관계가 잘 잡혔는지 코드로 확인

```bash
node -e "
import('@prisma/client').then(async ({ PrismaClient }) => {
  const p = new PrismaClient();
  const todos = await p.todo.findMany({ include: { tags: true }, take: 4 });
  console.log(JSON.stringify(todos, null, 2));
  await p.\$disconnect();
});
"
```

각 Todo 의 `tags` 배열이 들어와 있어야 해요. (`운동하기` Todo 는 태그 2개가 붙어 있어야 함)

> 📚 `include` 의 사용법은 **실습#11 (practice-11)** 에서 본격적으로 다뤄요.

---

## 💡 N:M 의 가장 중요한 한 가지

> **외래 키 컬럼을 적지 않습니다.** Tag 에도 todoId 없고, Todo 에도 tagId 없어요. **양쪽 다 배열 필드만** 있죠. Prisma 가 알아서 `_TodoToTag` 라는 중간 테이블에 `(A=todoId, B=tagId)` 쌍을 적어 주거든요.

또 하나 — N:M 에서 자식을 연결할 때는 `createMany` 가 못 쓰여요 (nested 관계 미지원). 그래서 시드의 정해진 Todo 4개는 개별 `prisma.todo.create({...})` 로 만듭니다. 랜덤 30개는 태그가 없으니 그대로 `createMany` 로 OK.

---

## 🧠 막히면?

```bash
# 다음 브랜치(practice-9) 에 정답 + 다음 챕터(User-Profile 1:1) 가 있어요.
git checkout practice-9

# 또는 reference 브랜치 (전체 정답)
git checkout reference

# 다시 돌아오기
git checkout practice-8
```

---

## 📚 교안 참고 포인트

- **2. Todo—Tag N:M 스키마 패턴** — 양쪽 배열 필드만, 외래 키 없음.
- **N:M 중간 테이블 (`_TodoToTag`)** — Prisma 가 자동 생성. `A` 는 알파벳 순으로 앞 모델(Todo), `B` 는 뒤 모델(Tag) 의 id.
- **`connect` 문법** — "기존 행을 잇기"위한 키워드. 새 행 만들기는 `create`.
