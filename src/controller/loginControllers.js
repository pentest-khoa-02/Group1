import {PrismaClient } from '@prisma/client'
import bcryptjs from "bcryptjs"
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import { v4 as uuidv4 } from 'uuid';
import fs from "fs"
import { fileURLToPath } from 'url'
import path from "path"
import csrf from "csrf"
import queryString from 'query-string';
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
//handl Oauth 

const stringifiedParams = queryString.stringify({
  client_id: process.env.FACEBOOK_APP_ID,
  redirect_uri: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
  response_type: "code",
  state: "hiihihihihi"
});

const facebookLoginUrl = {url:`https://www.facebook.com/v20.0/dialog/oauth?${stringifiedParams}`
}

const prisma = new PrismaClient()


const getLoginPage =(req,res) =>{
   return res.render('form-login', { layout: false ,urllogin:facebookLoginUrl})
}
const handleLogin = async (req,res) =>{
    const {email,password,rememberme} = await req.body
    try{
      //check setting 
      const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='SQL Injection'`
      let result
      if (setting.status === 'Hard'){
       result = await prisma.$queryRawUnsafe(`SELECT * FROM \"user\" where email='${email}'`)
      } 
      else{
       result = await prisma.$queryRaw`SELECT * FROM \"user\" where email=${email}`
      }
      //verifty 
      if(result.length == 0 || md5(password) !== result[0].password) {
          const error = {
              message : "Email or Password is incorrect hihi !"
          }
         return res.render('form-login', { layout: false ,error:error,urllogin:facebookLoginUrl})
      }
      else if(!result[0].email_verify){
        //hanle not verify email 
        return res.render('email_ver',{layout : false})
      }
      
      else{
        const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='JWT'`
        let token, header
        if (setting.status === "Easy" || setting.status === "Hard") {
          header = {
            alg: 'HS256',
            typ: 'JWT',
          }
        }
        else { //Medium and None
          header = {
            alg: 'RS256',
            typ: 'JWT',
          }
        }
        const payload = {
          id: result[0].id,
          username: result[0].username,
        }
        let jwtsecret = process.env.SecretJWT
        let privateKey

      if (setting.status === "Easy") {
        jwtsecret = process.env.NotSecretJWT //NotSecretJWT
      }
      else if(setting.status === "Hard"){
       header.kid = "6f597b7-fd81-44c7-956f-6937ea94cdf6"
       const data = fs.readFileSync(path.join(__dirname,'../helper/key/',header.kid),'utf-8')
       jwtsecret = data
      }
      else { //Medium and None
        header.kid = "6f597b7-fd81-44c7-956f-6937ea94cdf6"
        privateKey = fs.readFileSync(path.join(__dirname,'../helper/key/privatekey.pem'),'utf-8')
      }
      if (setting.status === "Easy" || setting.status === "Hard") {
        token=jwt.sign(payload,jwtsecret,{expiresIn: '5d' ,header })
      } 
      else { //Medium and None
        token = jwt.sign(payload, privateKey, { algorithm: 'RS256', header });
      }
          
        res.cookie("jwt", token, {
          httpOnly: false,
          maxAge: 10000 * 1000,
          // sameSite: 'None',
          // secure: true
        });
        const [settingCsrf] = await prisma.$queryRaw`Select status from vulnerable where name='CSRF'`
        const tokens = new csrf();
        const secret = process.env.Secretcsrf; 
        let csrfToken = tokens.create(secret);
        if(settingCsrf.status === 'Easy'){
          csrfToken= "aebh==787ashsvvlqxnah"
        }
        
        res.cookie("csrfToken", csrfToken, {
          httpOnly: false,
          maxAge: 10000 * 1000,
        });

        //CRLF  injection 
        let referer = req.headers.referer 
        if(referer.includes('returnURL')){
          let params = new URL(referer).searchParams
          // res.statusCode = 302;
          // res.setHeader('Location', `${params.get('returnURL')}`)
          // return  res.end();
          return res.redirect(`${params.get('returnURL')}`)
        }
        return res.redirect('/')
      }
    } catch(ERROR) {
      console.log(ERROR)
      const error = {
        message : "Email or Password is incorrect !"
    }

   return res.render('form-login', { layout: false ,error:error,urllogin:facebookLoginUrl})
    }
}

export default {getLoginPage,handleLogin}