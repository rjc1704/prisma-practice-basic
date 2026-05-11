# practice-10 — Relation onDelete (Cascade)

> 📚 **[3] 관계 챕터 4 (실습#10)** 에 해당해요.

## 🎯 이번 브랜치 목표

"**부모가 삭제되면 자식은 어떻게 되나?**" 를 명시적으로 정합니다. 우리 도메인에서는 **사용자 탈퇴 = 그 사용자의 Todo / Profile 도 함께 삭제** 가 자연스러우니 `Cascade` 를 적용합니다.

```
User 삭제
  ↓ (Cascade)
  ├─ 그 User 의 Todo 들 자동 삭제
  └─ 그 User 의 Profile 자동 삭제
```

> 💡 onDelete 4가지 옵션 — `Restrict`(기본, 자식 있으면 부모 못 지움) / `Cascade`(같이 삭제) / `SetNull`(자식의 외래 키를 NULL) / `NoAction`(DB 위임). 도메인에 따라 의도적으로 선택.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ User + Todo + Tag + Profile 모델
- ✅ 1:N / N:M / 1:1 세 가지 관계 모두 정의
- ✅ 라우트: Todo CRUD, `GET /users/:userId/todos`, `GET /tags`, `GET /users/:id`

---

## ✅ TODO 체크리스트

> 🗂 **총 2 곳** — 핵심 키워드 한 단어를 두 번.

- [ ] **TODO-1**: `prisma/schema.prisma` — `Todo.user @relation(..., onDelete: ___)` 빈칸 1
- [ ] **TODO-2**: `prisma/schema.prisma` — `Profile.user @relation(..., onDelete: ___)` 빈칸 1 (같은 답)

---

## 🛠 실행 방법

```bash
# 1. (TODO-1, 2 채운 뒤) 마이그레이션
npx prisma migrate dev --name add_on_delete_cascade

# 2. 서버 실행
npm run dev
```

> ⚠️ 시드 재실행은 굳이 필요 없어요. 이번 챕터는 스키마 메타데이터(FK 제약)만 변경.

---

## 🧪 동작 확인

```bash
# 1. Alice 삭제 전 — Todo 개수 확인
curl http://localhost:3000/users/1/todos | head -50
#   → Alice 의 Todo 가 여러 개 보임

# 2. Alice 삭제 — Cascade 작동!
curl -X DELETE http://localhost:3000/users/1
#   → { success: true, message: 'User가 삭제되었습니다 ...' }

# 3. Alice 의 Todo 가 모두 사라졌는지 확인
curl http://localhost:3000/users/1/todos
#   → { success: true, count: 0, data: [] }

# 4. Alice 의 Profile 도 사라졌는지 확인 — 404 (Alice 자체가 없음)
curl http://localhost:3000/users/1
#   → { success: false, message: 'User를 찾을 수 없습니다' }
```

만약 onDelete 가 `Restrict` (기본값) 라면 2번에서 **에러**가 떨어집니다:
```json
{ "success": false, "message": "데이터를 찾을 수 없습니다" }
```
혹은 더 정확한 메시지로 "Foreign key constraint violated" — 자식이 있어서 부모 삭제 거부.

---

## 💡 Cascade 가 항상 정답은 아니에요

도메인에 따라 **`Restrict` 가 더 안전한 경우**도 많습니다. 예:
- 결제 정보처럼 함부로 지우면 안 되는 도메인 → `Restrict`
- 게시글이 사라지면 댓글도 같이 사라져야 자연스러움 → `Cascade`
- 회원 탈퇴 후에도 작성 글은 익명으로 남기고 싶음 → `SetNull` (외래 키가 nullable 여야 함)

**N:M 의 중간 테이블** (`_TodoToTag`) 은 Prisma 가 알아서 정리합니다. Todo 삭제 → `_TodoToTag` 의 해당 행만 자동 삭제. Tag 자체는 그대로 (다른 Todo 가 쓸 수 있으니까).

---

## 🧠 막히면?

```bash
git checkout practice-11   # 다음 (include / select / 관계 필터링)
git checkout reference     # 전체 정답
git checkout practice-10   # 복귀
```

---

## 📚 교안 참고 포인트

- **4. Relation 의 onDelete 설정** — 4 옵션 중 Cascade / Restrict 가 90% 차지.
- **Prisma SQL 출력 확인** — `prisma migrate dev` 로 생성된 `migration.sql` 안 `ON DELETE CASCADE` 구문이 들어 있는지 보면 학습에 도움이 돼요.
