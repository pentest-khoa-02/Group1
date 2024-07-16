import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import fs from "fs"
import { fileURLToPath } from 'url'
import path from "path"
//const __filename = fileURLToPath(import.meta.url)
//const __dirname = path.dirname(__filename)

const checkisAdmin = async (req,res,next ) => {
   try {
    let key, value
    if (req.headers.cookie){
      req.headers.cookie.split('; ').forEach(cookie => {
        const [k, v] = cookie.split('=');
        if (k === 'jwt')
        {
          key = k
          value = v
        }
      });
    }
    // console.log(value)
    const decoded = jwt.decode(value)
   //query isAdmin
    const [isAdmin] = await prisma.$queryRaw`Select role_id from user_role where user_id= ${decoded.id}` 
    if(isAdmin != undefined && isAdmin.role_id == 1){
        next()
    }else{
        return res.send('Only access by admin')
    }
   } catch (error) {
    return res.send(error)
   }
}

export default {checkisAdmin}