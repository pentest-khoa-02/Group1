import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const deleteuserinfo = await prisma.user_info.deleteMany({});
    const deleteuser = await prisma.user.deleteMany({});
    const deletepost = await prisma.post.deleteMany({});
    const deletestory = await prisma.story.deleteMany({});
    const deletephoto = await prisma.photo.deleteMany({});
    const deletevideo = await prisma.video.deleteMany({});
    const deletelogin = await prisma.login.deleteMany({});
    const deleteregister = await prisma.register.deleteMany({});
    const deletemessage = await prisma.message.deleteMany({});
    const deleteuser_relationship = await prisma.user_relationship.deleteMany({});
}

export {main}
