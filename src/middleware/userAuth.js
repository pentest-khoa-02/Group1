import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import fs from "fs"
import { fileURLToPath } from 'url'
import path from "path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
import axios from 'axios';
import jwkToPem from 'jwk-to-pem';

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
          let token = value
          let decoded;
          const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='JWT'`
          //verifty token
          if (setting.status === "Easy"){
            decoded = jwt.verify(token, process.env.NotSecretJWT) //NotSecretJWT
          }
          else if (setting.status === "Medium"){
            let rsaKey
            let url
            const header = jwt.decode(token, { complete: true }).header
            if (header.jku) {
              url = header.jku
            }
            else {
              url = "http://localhost:3000/.well-known/jwks.json"
            }
            await axios.get(url)
              .then(response => {
                const data = response.data;
                rsaKey = {
                  kty: data.keys[0].kty,
                  e: data.keys[0].e,
                  kid: data.keys[0].kid,
                  n: data.keys[0].n
                };
            })
            const publickey = jwkToPem(rsaKey);
            decoded = jwt.verify(token, publickey)
          }
          else if (setting.status === "Hard"){
               const header=jwt.decode(token, { complete: true }).header;
               const  secretkey = fs.readFileSync(path.join(__dirname,'../helper/key/',header.kid),'utf-8') 
                decoded = jwt.verify(token, secretkey) 
          }
          else { //None injection
            const publickey = fs.readFileSync(path.join(__dirname,'../helper/key/publickey.pem'),'utf-8') 
            decoded = jwt.verify(token, publickey)
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