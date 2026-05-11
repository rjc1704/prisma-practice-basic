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
  await prisma.user.deleteMany();
  console.log('🧹 기존 데이터 삭제 완료');

  // ----------- 사용자 시드 -----------
  // createMany 대신 단일 create — 반환되는 id 를 Todo.userId 로 써야 하기 때문.
  const alice = await prisma.user.create({ data: { name: 'Alice' } });
  const bob   = await prisma.user.create({ data: { name: 'Bob'   } });
  console.log('👥 사용자 2명 생성');

  // ----------- 정해진 Todo 4개 -----------
  await prisma.todo.createMany({
    data: [
      { title: '우유 사오기',      content: '저지방 1L',       isDone: false, userId: alice.id },
      { title: 'Prisma 공부하기',  content: '교안 3챕터까지',  isDone: false, userId: alice.id },
      { title: '운동하기',         content: '30분 조깅',       isDone: true,  userId: alice.id },
      { title: '이메일 확인',                                   isDone: true,  userId: bob.id   }
    ]
  });
  console.log('📝 정해진 Todo 4개 생성');

  // ----------- 랜덤 Todo 30개 -----------
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
