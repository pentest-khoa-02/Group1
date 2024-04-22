import {PrismaClient } from '@prisma/client'
import bcryptjs from "bcryptjs"
import jsonwebtoken from 'jsonwebtoken'
import md5 from 'md5'
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient()

const getLoginPage =(req,res) =>{
    res.render('form-login', { layout: false })
}
const handleLogin = async (req,res) =>{
    const {email,password,rememberme} = await req.body
    
    try{
      //check setting 
      const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='SQL Injection'`
      let result
      if (setting.status === 'Yes'){
       result = await prisma.$queryRawUnsafe(`SELECT * FROM \"user\" where email='${email}'`)
      }else {
       result = await prisma.$queryRaw`SELECT * FROM \"user\" where email=${email}`
      }
      //verifty 
      if(result.length == 0 || md5(password) !== result[0].password) {
          const error = {
              message : "Email or Password is incorrect !"
          }
         return res.render('form-login', { layout: false ,error:error})
     
      }else{
          //create JWT token 1
          const jwtsecret = process.env.SecretJWT
       const payload = {
            id: result[0].id,
            username: result[0].username,
         }
      // origin - not bug
      const token = jsonwebtoken.sign(payload,jwtsecret,{
          expiresIn: '5d'
         })
         res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: 10000 * 1000,
        });
          res.redirect('/')
      }

      // lv3 - to be continue..
      /*const kid = "9124495c-2e4d-4bfa-846e-c534da336ceb";
      const jwtHeader = {
        alg: 'RS256',
        typ: 'JWT',
        kid: kid
      };
      const token = jsonwebtoken.sign(payload,jwtsecret,{
        algorithm: 'RS256',
        expiresIn: '5d',
        header: jwtHeader
       })
       res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 10000 * 1000,
      });
        res.redirect('/')
      }*/
    } catch(ERROR) {
      const error = {
        message : "Email or Password is incorrect !"
    }
   return res.render('form-login', { layout: false ,error:error})
    }
}
export default {getLoginPage,handleLogin}