import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'
import fs from "fs"
import { fileURLToPath } from 'url'
import path from "path"
import csrf from "csrf"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const getEmail_VerPage = async (req,res) => {

   const email_secret = process.env.SecretJWT
    try {
        const decoded = jwt.verify( req.params.token,email_secret)
    const user = {
        username : decoded.username,
        link : `/`
    }
     //update property 
     const result =  await prisma.user.update({
        where:{
            email: decoded.email
        },
        data:{
            email_verify: true
        }
     })
    //set cookie 
       // handle create account with set jwt 
   let jwtsecret = process.env.SecretJWT 
   const payload = {
      id : decoded.userid ,
      username : user.username
   }
  const header = {
      alg: 'RS256',
      typ: 'JWT',
      'kid': "6f597b7-fd81-44c7-956f-6937ea94cdf6"
    }
        
    const  privateKey = fs.readFileSync(path.join(__dirname,'../helper/key/privatekey.pem'),'utf-8')

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', header });
   //set cookie 
   res.cookie("jwt", token, {
    httpOnly: false,
    maxAge: 10000 * 1000,
  });

  const tokens = new csrf();
  const secret = process.env.Secretcsrf; 
  let csrfToken = tokens.create(secret);
  res.cookie("csrfToken", csrfToken, {
    httpOnly: false,
    maxAge: 10000 * 1000,
  });
  return res.redirect('/')

    } catch (error) {
        console.log(error)
      
    }
}

export default {getEmail_VerPage}