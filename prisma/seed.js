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
  // 기존 데이터 삭제 (todos → users 순서)
  await prisma.todo.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 기존 데이터 삭제 완료');

  // ----------- 사용자 시드 -----------
  await prisma.user.createMany({
    data: [
      { name: 'Alice' },
      { name: 'Bob' }
    ]
  });
  console.log('👥 사용자 2명 생성');


  // ----------- 정해진 Todo 4개 -----------
  //
  // ✏️ TODO-2: 아래 ___ 두 군데를 채우세요.
  //   ① 여러 행을 한 번에 INSERT 하는 Prisma 메서드 이름은? (create / createMany / findMany 중)
  //   ② 마지막 Todo "이메일 확인" 은 이미 확인을 끝낸 상태입니다. isDone 값은? (true / false)
  //
  await prisma.todo.___({                                                            // ← ①
    data: [
      { title: '우유 사오기',      content: '저지방 1L',       isDone: false },
      { title: 'Prisma 공부하기',  content: '교안 3챕터까지',  isDone: false },
      { title: '운동하기',         content: '30분 조깅',       isDone: true  },
      { title: '이메일 확인',                                   isDone: ___   }      // ← ②
    ]
  });
  console.log('📝 정해진 Todo 4개 생성');


  // ----------- 랜덤 Todo 30개 -----------
  //
  // ✏️ TODO-3: 아래 ___ 한 군데를 채우세요.
  //   - faker.datatype 에는 true/false 를 무작위로 만들어 주는 메서드가 있어요.
  //     메서드 이름은 무엇일까요? (boolean / random / chance 중)
  //
  const randomTodos = [];
  for (let i = 0; i < 30; i++) {
    randomTodos.push({
      title:   faker.lorem.sentence(3),
      content: faker.lorem.sentence(10),
      isDone:  faker.datatype.___()                                                  // ← TODO-3
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
