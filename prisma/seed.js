// ============================================
// 시드 스크립트
// ============================================
//
// 실행 방법:
//   npm run seed           ← package.json scripts 사용
//   npx prisma db seed     ← prisma 설정 활용

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.todo.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 기존 데이터 삭제 완료');

  // ----------- 사용자 시드 -----------
  const alice = await prisma.user.create({ data: { name: 'Alice' } });
  const bob   = await prisma.user.create({ data: { name: 'Bob'   } });
  console.log('👥 사용자 2명 생성');

  // ----------- 태그 시드 -----------
  const tagHome   = await prisma.tag.create({ data: { name: '집안일' } });
  const tagStudy  = await prisma.tag.create({ data: { name: '공부'   } });
  const tagHealth = await prisma.tag.create({ data: { name: '건강'   } });
  console.log('🏷  태그 3개 생성');

  // ----------- 정해진 Todo 4개 (태그 포함) -----------
  //
  // ✏️ TODO-4: 이미 만들어진 태그를 Todo 에 매다는 키워드는?
  //   힌트: "create / connect / link" 중 — N:M 에서 "기존 행을 잇는" 것은 무엇?
  //         (새 Tag 를 만드는 게 아니라 위에서 만든 tagHome / tagStudy 를 연결하는 거예요.)
  //         createMany 는 nested 관계를 지원 안 하니, 여기서는 개별 create 로 만듭니다.
  await prisma.todo.create({
    data: {
      title: '우유 사오기',
      content: '저지방 1L',
      isDone: false,
      userId: alice.id,
      tags: { ___: [{ id: tagHome.id }] }                              // ← TODO-4
    }
  });
  await prisma.todo.create({
    data: {
      title: 'Prisma 공부하기',
      content: '교안 3챕터까지',
      isDone: false,
      userId: alice.id,
      tags: { connect: [{ id: tagStudy.id }] }
    }
  });
  await prisma.todo.create({
    data: {
      title: '운동하기',
      content: '30분 조깅',
      isDone: true,
      userId: alice.id,
      tags: { connect: [{ id: tagHealth.id }, { id: tagHome.id }] }    // 한 Todo 에 태그 2개
    }
  });
  await prisma.todo.create({
    data: {
      title: '이메일 확인',
      isDone: true,
      userId: bob.id
      // tags 없음 — N:M 은 자식이 0개여도 OK
    }
  });
  console.log('📝 정해진 Todo 4개 생성 (태그 포함)');

  // ----------- 랜덤 Todo 30개 (태그 없이, createMany 그대로) -----------
  const userIds = [alice.id, bob.id];
  const randomTodos = [];
  for (let i = 0; i < 30; i++) {
    randomTodos.push({
      title: faker.lorem.sentence(3),
      content: faker.lorem.sentence(10),
      isDone: faker.datatype.boolean(),
      userId: userIds[i % 2]
    });
  }
  await prisma.todo.createMany({ data: randomTodos });
  console.log('🎲 랜덤 Todo 30개 생성');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
