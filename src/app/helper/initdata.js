import { PrismaClient } from '@prisma/client'
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient()

//data fake 
const data = JSON.parse(fs.readFileSync(path.join(__dirname,"data.json")));
//handl
async function main() {
      try {
        // Delete all records
        await prisma.video.deleteMany();
        await prisma.photo.deleteMany();
        await prisma.post.deleteMany();
        await prisma.user_info.deleteMany();
        await prisma.user.deleteMany();
        console.log("All records deleted successfully.");
      } catch (error) {
        console.error("Error deleting records:", error);
      } 

    // create many  
    const createMany = await prisma.user.createMany(
        {
            data:data['User']
        }
    )
    const createManyInfo  =  await prisma.user_info.createMany(
        {
            data :data['User_info']    
        }
    )
    const createManyPost = await prisma.post.createMany(
        {
            data:data['Post']
        }
    )
    const createManyPhoto =  await prisma.photo.createMany(
        {
            data:data['Photo']
        }
    )
    const createManyVideo = await prisma.video.createMany(
        {
            data:data['Video']
        }
    )
    let datapro = JSON.stringify(data['User']) + JSON.stringify(data['User_info']) + JSON.stringify(data['Post']) + JSON.stringify(data['Photo']) + JSON.stringify(data['Video']); 
    return datapro
} 

export {main}
