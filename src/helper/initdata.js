import { PrismaClient } from '@prisma/client'
import {faker} from '@faker-js/faker'
const prisma = new PrismaClient()

async function main() {
  for(let i = 1; i <= 10; i++)
  {
    const createUser = await prisma.user.create ({
      data:{
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
      }
    })
    const UserInfo = await prisma.user_info.create({
      data: {
          firstname: faker.person.firstName(),
          lastname: faker.person.lastName(),
          university: faker.company.name(),
          live: faker.location.country(),
          job: 'Student',
          userid: createUser.id,
      }
    })

    const post = await prisma.post.create({
      data: {
        userId: createUser.id,
        content: "Hello " + faker.person.fullName(),
      }
    })

    const story = await prisma.story.create({
      data: {
        userId: createUser.id,
        content: "Hello " + faker.person.fullName(),
      }
    })

    const photo = await prisma.photo.create({
      data: {
        url: faker.image.url(),
        postId: post.id,
        storyId: story.id
      }
    })

    const video = await prisma.video.create({
      data: {
        url: faker.music.songName(),
        postId: post.id,
        storyId: story.id
      }
    })
  }
  
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })