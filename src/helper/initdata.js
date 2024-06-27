import { PrismaClient } from '@prisma/client'
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);
const prisma = new PrismaClient()
import moment from 'moment-timezone';

//data fake 
const data = JSON.parse(fs.readFileSync(path.join(__dirname,"data.json")));

//handl
async function main() {
      try {
        // Delete all records
        await prisma.user_role.deleteMany();
        await prisma.role_permission.deleteMany();
        await prisma.roles.deleteMany();
        await prisma.permission.deleteMany();
        await prisma.message.deleteMany();
        await prisma.video.deleteMany();
        await prisma.photo.deleteMany();
        await prisma.post_comment.deleteMany();
        await prisma.post.deleteMany();
        await prisma.user_info.deleteMany();
        await prisma.user.deleteMany();
        await prisma.vulnerable.deleteMany();
        console.log("All records deleted successfully.");
      } catch (error) {
        console.error("Error deleting records:", error);
      } 

    // create many  
    const createMany = await prisma.user.createMany(
        {
            data:data['user']
        }
    )
    const createManyInfo  =  await prisma.user_info.createMany(
        {
            data :data['user_info']    
        }
    )

    const currentTime = moment().toISOString()
    for (let i = 0; i < data['post'].length; ++i) {
        data['post'][i].create_at = currentTime
    }
    const createManyPost = await prisma.post.createMany(
        {
            data:data['post']
        }
    )
    const createManyPostComment = await prisma.post_comment.createMany(
        {
            data:data['post_comment']
        }
    )
    const createManyPhoto =  await prisma.photo.createMany(
        {
            data:data['photo']
        }
    )
    const createManyVideo = await prisma.video.createMany(
        {
            data:data['video']
        }
    )
    const createManyVulnerable = await prisma.vulnerable.createMany(
        {
            data:data['vulnerable']
        }
    )
    const createManyMessage = await prisma.message.createMany(
        {
            data:data['message']
        }
    )
    const createManyRole = await prisma.roles.createMany(
        {
            data:data['roles']
        }
    )
    const createManyPer = await prisma.permission.createMany(
        {
            data:data['permissions']
        }
    )
    const createManyPer_role = await prisma.role_permission.createMany(
        {
            data:data['role_permission']
        }
    )
    const createManyUser_role = await prisma.user_role.createMany(
        {
            data:data['user_role']
        }
    )
    let datapro = JSON.stringify(data['user']) + JSON.stringify(data['user_info']) + JSON.stringify(data['post']) + JSON.stringify(data['photo']) + JSON.stringify(data['video']) + JSON.stringify(data['vulnerable']); 
    return datapro
} 

export {main}
