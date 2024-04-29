import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import fs from "fs"
import { fileURLToPath } from 'url'
import path from "path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const userAuth = async (req,res,next) => {
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

    try{
      if(req.path === '/fakedata' || req.path.includes('/settings')
        || (req.path === '/form-login' && (!key || !value)) ){
         next()
      }
       else {
          const token = value
          let decoded;
          const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='JWT'`
          //verifty token
          if (setting.status === "Easy"){
            decoded = jwt.decode(token)
          }
          else if (setting.status === "Medium"){
            decoded = jwt.verify(token, process.env.NotSecretJWT) // NotSecretJWT
          }
          else if (setting.status === "Hard"){
               const header=jwt.decode(token, { complete: true }).header;
               const  secretkey = fs.readFileSync(path.join(__dirname,'../helper/key/',header.kid),'utf-8') 
                decoded = jwt.verify(token, secretkey) 
          }
          else {
            decoded = jwt.verify(token, process.env.SecretJWT)
          }
          req.decoded = decoded
          const username = decoded.username
          const result = await prisma.user.findUnique({
            where: {
                username: username,
              },
          })
          if (req.path === '/form-login')
            return res.redirect("/")
          if (result !== null){
              next()
          }
      }
    } catch (error) {
        return res.clearCookie('jwt').redirect('/form-login')
    }
}

export {userAuth}