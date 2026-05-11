# Prisma 실습 (Prisma + Express CRUD)

관계형 데이터베이스를 처음 배운 학생들을 위한 **단계별 Prisma 실습 저장소**입니다. 교안의 흐름을 그대로 따라가며 한 챕터씩 직접 손으로 만들어 봅니다.

---

## 🌳 브랜치 구성

각 브랜치는 **이전 브랜치의 정답을 모두 포함**하고, **그 챕터에 해당하는 새로운 TODO만 비어 있는 상태**예요.

| 브랜치 | 챕터 | 무엇을 배우나요? |
|---|---|---|
| `practice-1` | 1, 2, 3 | 프로젝트 셋업 + Prisma 초기화 + User 모델 + 첫 마이그레이션 |
| `practice-2` | 4, 5 | Product 모델 추가 + 시딩 (faker) |
| `practice-3` | 6 | Product CRUD (Create / Read / Update / Delete / Count) |
| `practice-4` | 7 | 쿼리 파라미터 (필터 / 검색 / 정렬 / 페이지네이션) |
| `practice-5` | 9 | Zod 유효성 검사 + 미들웨어 |
| `practice-6` | 10 | 오류 처리 (asyncHandler + 커스텀 에러 + 글로벌 핸들러) |
| `practice-7` | 8, 11 | 심화 — aggregate / groupBy / distinct / raw / 트랜잭션 |
| `reference` | 전체 정답 | 완성본. 막힐 때 비교용으로 참고 |

---

## 🚀 실습 시작하기

```bash
# 1. 저장소 클론 (또는 본인 환경에서 git remote add)
git clone <repo-url>
cd prisma-practice

# 2. 첫 번째 실습 브랜치로 이동
git checkout practice-1

# 3. 브랜치마다 들어 있는 README.md를 보고 TODO를 채워나가세요!
```

---

## 💡 막힐 때

```bash
# 다음 브랜치로 잠깐 넘어가서 정답 보기
git checkout practice-2

# 다시 내 실습 브랜치로 돌아오기
git checkout practice-1
```

학생이 작성한 답은 **굳이 커밋하지 않아도 괜찮아요.** 브랜치 사이를 자유롭게 오가면서 비교하세요. (커밋하고 싶다면 본인 fork에서 자유롭게!)

---

## ⚙️ 환경 준비물

- **Node.js** 20 이상
- **PostgreSQL** (로컬 설치 또는 [Render.com 무료 DB](https://render.com))
- **DBeaver** (선택 — DB 시각화)

> 💡 PostgreSQL 외부 DB URL이 필요해요. `.env.example` 파일을 복사해서 `.env`로 만들고 본인 URL을 넣어주세요.
