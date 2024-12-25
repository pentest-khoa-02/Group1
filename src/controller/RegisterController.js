import { prisma } from "../config/prisma.js"
import jwt from 'jsonwebtoken'
import md5 from 'md5'
import Mailer from "../helper/mailer/sendmail.js"
const getPageRegister = (req,res) => {
   return res.render('form-register',{layout:false})
}

const handleRegister = async (req,res) =>{
    //logic here 
    //Get data 
   const{text,email,password} = req.body 
   const firstname = text[0] ? text[0] : "NULL"
   const lastname = text[1] ? text[0] : "NULL"
   const user_password =password[0] ? password[0] : "NULL"
   const user_confirm_password = password[1] ? password[1] : "NULL"
   const jwtsecret = process.env.SecretJWT
   let payload 
   const email_alreader = await prisma.user.findUnique({
    where:{
        email : email
    }
   })
   //create account 
   if(firstname && lastname && (user_password === user_confirm_password) && !email_alreader){
    try { 
      
        const lastUser = await prisma.user.findFirst({
            orderBy: {
              id: 'desc', // Sắp xếp giảm dần theo ID
            },
          });
      const user = await prisma.user.create({
            data: {
              id: lastUser.id + 1,
              email: email,
              username: lastname + " " + firstname,
              password: md5(user_confirm_password),
              passwordnotsecret: "admin123",
            },
          })
   
          //create user_info 
        const user_info = await prisma.user_info.create({
            data : {
               userid: lastUser.id + 1 ,
               lastname : lastname,
               firstname : firstname,
               university : 'KMA',
               job : "Sinh Viên",
               avatar : "/assets/images/avatars/avatar-1.jpg",
               live : "Ha Noi",
               
            }
          })

          payload = {
            userid   : lastUser.id + 1 ,
            username : lastname + " " + firstname ,
            email : email
          }
      } catch (error) {
        console.log(error)
        error.message = "Something went wrong"
        return res.render('form-register',{layout:false,error:error})
    }
   }else{
    const error = {
        message : "Missing parameter or not comparing password confirm, or email already"
    }
     return res.render('form-register',{layout:false,error : error})
   }
   //generate token 
   const token = jwt.sign(payload,jwtsecret,{ algorithm: 'HS256' })

   //send mail to user' email
  //  const verificationUrl = `${process.env.CLIENT_URL}/confirm/email_verification/${token}`;
   const verificationUrl = `http://10.1.1.94/confirm/email_verification/${token}`;
   const message = `
    <h1>Welcome to Our Service</h1>
    <p>Hi ${lastname + " " + firstname},</p>
    <p>Thank you for registering with us. Please click the link below to verify your email:</p>
    <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none;">Verify Email</a>
    <p>If you did not request this, please ignore this email.</p>
    <p>Best regards,</p>
    <p>The Team</p>
  `;
   await Mailer.sendEmail({
    email: email,
    subject: 'Email Verification',
    html:message,
   })
   return res.render('email_ver',{layout : false})
}
export default {getPageRegister,handleRegister}