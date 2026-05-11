// ============================================
// 시드 스크립트
// ============================================

import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  await prisma.todo.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 기존 데이터 삭제 완료');

  // ----------- 사용자 + Profile -----------
  const alice = await prisma.user.create({
    data: {
      name: 'Alice',
      profile: {
        create: {
          bio: '풀스택 개발 공부 중',
          avatarUrl: 'https://example.com/alice.png'
        }
      }
    },
    include: { profile: true }
  });
  const bob = await prisma.user.create({ data: { name: 'Bob' } });
  console.log('👥 사용자 2명 생성 (Alice: 프로필 있음, Bob: 없음)');

  // ----------- 태그 -----------
  const tagHome   = await prisma.tag.create({ data: { name: '집안일' } });
  const tagStudy  = await prisma.tag.create({ data: { name: '공부'   } });
  const tagHealth = await prisma.tag.create({ data: { name: '건강'   } });
  console.log('🏷  태그 3개 생성');

  // ----------- 정해진 Todo 4개 -----------
  await prisma.todo.create({
    data: { title: '우유 사오기',     content: '저지방 1L',      isDone: false, userId: alice.id, tags: { connect: [{ id: tagHome.id }] } }
  });
  await prisma.todo.create({
    data: { title: 'Prisma 공부하기', content: '교안 3챕터까지', isDone: false, userId: alice.id, tags: { connect: [{ id: tagStudy.id }] } }
  });
  await prisma.todo.create({
    data: { title: '운동하기',        content: '30분 조깅',      isDone: true,  userId: alice.id, tags: { connect: [{ id: tagHealth.id }, { id: tagHome.id }] } }
  });
  await prisma.todo.create({
    data: { title: '이메일 확인',                                isDone: true,  userId: bob.id }
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
