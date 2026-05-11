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
  //
  // ✏️ TODO-3: 아래 ___ 두 군데에 들어갈 Prisma 메서드는? (같은 답, 두 번)
  //   힌트: createMany 가 아니에요!
  //         Todo 를 만들 때 사용자의 id 를 알아야 userId 로 묶을 수 있는데,
  //         createMany 의 반환값은 { count } 뿐이라 id 를 못 받아요.
  //         id 를 돌려주는, 한 번에 한 행을 만드는 메서드는?
  const alice = await prisma.user.___({ data: { name: 'Alice' } });  // ← TODO-3
  const bob   = await prisma.user.___({ data: { name: 'Bob'   } });  // ← TODO-3
  console.log('👥 사용자 2명 생성');

  // ----------- 정해진 Todo 4개 -----------
  //
  // ✏️ TODO-4: 마지막 Todo("이메일 확인") 의 userId 를 채우세요.
  //   힌트: 이 할 일은 Bob 의 것이에요. 위에서 만든 변수 이름 + ".id" 를 떠올려 보세요.
  await prisma.todo.createMany({
    data: [
      { title: '우유 사오기',      content: '저지방 1L',       isDone: false, userId: alice.id },
      { title: 'Prisma 공부하기',  content: '교안 3챕터까지',  isDone: false, userId: alice.id },
      { title: '운동하기',         content: '30분 조깅',       isDone: true,  userId: alice.id },
      { title: '이메일 확인',                                   isDone: true,  userId: ___      }   // ← TODO-4
    ]
  });
  console.log('📝 정해진 Todo 4개 생성');

  // ----------- 랜덤 Todo 30개 -----------
  //   Alice / Bob 에게 번갈아 분배합니다. 학생이 손댈 곳은 없어요.
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
