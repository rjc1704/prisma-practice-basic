# practice-9 — User ↔ Profile 일대일 (1:1) 관계

> 📚 **[3] 관계 챕터 3 (실습#9)** 에 해당해요.

## 🎯 이번 브랜치 목표

`Profile` 모델을 추가해서 **한 사용자가 프로필 0~1 개**를 가질 수 있게 합니다. 1:1 은 1:N 에서 단 한 줄만 바뀌어요 — 외래 키에 `@unique` 가 붙는 게 전부.

```
User  1 ─── 1  Profile     (Profile 은 선택적: 있을 수도, 없을 수도)
       profile?       userId Int @unique
```

> 💡 **1:N 과 1:1 의 차이는 단 한 단어** — 외래 키에 `@unique` 만 추가하면 됩니다. Prisma 가 이걸 보고 "아 1:1 이구나" 하고 알아채요.

---

## ✅ 이전 브랜치까지 완료된 것

- ✅ User / Todo / Tag 모델 + **1:N + N:M** 관계
- ✅ 시드: 사용자 2 + 태그 3 + Todo 4 (태그 연결) + 랜덤 30
- ✅ 라우트: Todo CRUD 6, `GET /users/:userId/todos`, `GET /tags`

---

## ✅ TODO 체크리스트

> 🗂 **총 3 곳**.

- [ ] **TODO-1**: `prisma/schema.prisma` — `User.profile ___` 빈칸 1 (단수형 + 선택적)
- [ ] **TODO-2**: `prisma/schema.prisma` — `Profile.userId Int ___` 빈칸 1 (1:1 표시 속성)
- [ ] **TODO-3**: `prisma/seed.js` — Alice 생성 시 Profile 도 동시에 만드는 키워드 `profile: { ___: {...} }` 빈칸 1

---

## 🛠 실행 방법

```bash
# 1. (TODO-1, 2 채운 뒤) 마이그레이션
npx prisma migrate dev --name add_profile

# 2. (TODO-3 채운 뒤) 시드 재실행
npm run seed

# 3. 서버 실행
npm run dev
```

---

## 🧪 동작 확인

```bash
# Alice — 프로필 있음
curl http://localhost:3000/users/1
# → { success: true, data: { id: 1, name: 'Alice', profile: { bio: '...', avatarUrl: '...' } } }

# Bob — 프로필 없음
curl http://localhost:3000/users/2
# → { success: true, data: { id: 2, name: 'Bob', profile: null } }
```

---

## 💡 1:1 의 핵심 한 문장

> 외래 키에 **`@unique`** 만 붙이면 1:1 이 됩니다. "같은 userId 가진 Profile 행이 두 개 존재할 수 없다" 라는 의미.

또 — `User.profile` 처럼 1쪽 면을 적을 때 **단수형(`Profile?`)** 으로 적어야 해요. 1:N 의 `Todo[]` 와 다른 점.

중첩 `create` 패턴은 다른 관계(1:N, N:M) 에서도 동일하게 쓸 수 있어요. 회원가입 시 "사용자 + 프로필 한 번에 생성" 같은 시나리오에서 자주 등장.

---

## 🧠 막히면?

```bash
git checkout practice-10   # 다음 (onDelete)
git checkout reference     # 전체 정답
git checkout practice-9    # 복귀
```

---

## 📚 교안 참고 포인트

- **3. User—Profile 1:1 스키마 패턴** — 외래 키에 `@unique`. 1쪽 면은 `Profile?` 단수.
- **중첩 create** — `create` 안에 또 `create` 를 넣어 한 트랜잭션 안에서 두 행을 동시 생성.
