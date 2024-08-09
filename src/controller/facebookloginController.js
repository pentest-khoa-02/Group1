import axios from "axios"
import jwt from 'jsonwebtoken'
import { prisma } from "../config/prisma.js"
import { v4 as uuidv4 } from 'uuid';
import csrf from "csrf"
import fs from "fs"
import { fileURLToPath } from 'url'
import path from "path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const handerLogin = async (req,res)=>{
   //get code 
   const code = req.query.code 
   if(code){
      // handle get access token 
     
   try {
      const {data}  = await  axios({
         method: 'get',
         url : 'https://graph.facebook.com/v20.0/oauth/access_token',
         params :{
            client_id : process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_APP_SECRET,
            redirect_uri: process.env.FACEBOOK_APP_REDIRECT_LOGIN,
            code,
         }
      })
      const accesstoken = data.access_token
      // console.log(data)
    //handle get information 
    const information_user = await axios ({
      url : 'https://graph.facebook.com/v20.0/me',
      method: 'get',
      params: {
         fields:['id','first_name','last_name','email'].join(','),
         access_token : accesstoken,
      }
    }) 
    const data_user = information_user.data
    //get user's profile image 
    const image_response = await axios({
      url : `https://graph.facebook.com/v20.0/1545714026334064/picture`,
      params: {
         access_token : accesstoken,
         height : '1200',
         width : '1200'
      },
    })
    data_user.user_profile = image_response.request.res.responseUrl
    //check exits 
    let user = await prisma.user.findUnique({
      where: {
        email: `${data_user.email}`,
      },
    })
    if(!user){
      const lastUser = await prisma.user.findFirst({
         orderBy: {
           id: 'desc', // Sắp xếp giảm dần theo ID
         },
       });
       //create accout 
         user = await prisma.user.create({
         data: {
           id: lastUser.id + 1,
           email: data_user.email,
           username: data_user.last_name + data_user.first_name,
           password: "admin123",
           passwordnotsecret: "admin123"
         },
       })

       //create user_info 
     const user_info = await prisma.user_info.create({
         data : {
            userid: lastUser.id + 1 ,
            lastname : data_user.last_name,
            firstname : data_user.first_name,
            university : 'KMA',
            job : "Sinh Viên",
            avatar : data_user.user_profile,
            live : "Ha Noi",
            
         }
       })
    }
    // handle create account with set jwt 
   let jwtsecret = process.env.SecretJWT 
   const payload = {
      id : user.id ,
      username : user.username
   }
  const header = {
      alg: 'RS256',
      typ: 'JWT',
    }
             header.kid = "6f597b7-fd81-44c7-956f-6937ea94cdf6"
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
     return res.status(500).send(error)
   }
   }else {
      res.status(500).send("something went wrong")
   }
   
}

export default {handerLogin}