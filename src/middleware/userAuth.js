import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

//userAuth origin - not bug
//SecretJWT đổi thành chuỗi secret hơn
/*const userAuth = async (req,res,next) => {
    const prisma = new PrismaClient()
    try{
      if(req.path == '/form-login' && (!req.headers.cookie || !req.headers.cookie.split('=')[1]) 
        || req.path == '/fakedata' || req.path == '/settings'){
         next()
      }
       else {
          const token = req.headers.cookie.split('=')[1];
          //verifty token 
          const decoded = jwt.verify(token, process.env.SecretJWT)
          req.decoded = decoded
          const username = decoded.username
          const result = await prisma.user.findUnique({
            where: {
                username: username,
              },
          })
          if (req.path == '/form-login')
            return res.redirect("/")
          if (result != null){
              next()
          }
      }
    } catch (error) {
        return res.cookie('jwt', '', { expiresIn: '1d' }).redirect('/form-login')
    }
}*/

// userAuth with jwt injection lv1
const userAuth = async (req,res,next) => {
  const prisma = new PrismaClient()
  try{
    if(req.path == '/form-login' && (!req.headers.cookie || !req.headers.cookie.split('=')[1]) 
      || req.path == '/fakedata' || req.path == '/settings'){
       next()
    }
     else {
        const token = req.headers.cookie.split('=')[1];
        //verifty token 
        const decoded = jwt.decode(token)
        req.decoded = decoded
        const username = decoded.username
        const result = await prisma.user.findUnique({
          where: {
              username: username,
            },
        })
        if (req.path == '/form-login')
          return res.redirect("/")
        if (result != null){
            next()
        }
    }
  } catch (error) {
      return res.cookie('jwt', '', { expiresIn: '1d' }).redirect('/form-login')
  }
}

// userAuth with jwt injection lv2
/*const userAuth = async (req,res,next) => {
  const prisma = new PrismaClient()
  try{
    if(req.path == '/form-login' && (!req.headers.cookie || !req.headers.cookie.split('=')[1]) 
      || req.path == '/fakedata' || req.path == '/settings'){
       next()
    }
     else {
        const token = req.headers.cookie.split('=')[1];
        //verifty token 
        const decoded = jwt.verify(token, process.env.SecretJWT)
        req.decoded = decoded
        const username = decoded.username
        const result = await prisma.user.findUnique({
          where: {
              username: username,
            },
        })
        if (req.path == '/form-login')
          return res.redirect("/")
        if (result != null){
            next()
        }
    }
  } catch (error) {
      return res.cookie('jwt', '', { expiresIn: '1d' }).redirect('/form-login')
  }
}*/

// userAuth with jwt injection lv3 - to be continue ..
/*const userAuth = async (req,res,next) => {
  const prisma = new PrismaClient()
  try{
    if(req.path == '/form-login' && (!req.headers.cookie || !req.headers.cookie.split('=')[1]) 
      || req.path == '/fakedata' || req.path == '/settings'){
       next()
    }
     else {
        const token = req.headers.cookie.split('=')[1];
        //verifty token 
        const decoded = jwt.verify(token, process.env.SecretJWT)
        req.decoded = decoded
        const username = decoded.username
        const result = await prisma.user.findUnique({
          where: {
              username: username,
            },
        })
        if (req.path == '/form-login')
          return res.redirect("/")
        if (result != null){
            next()
        }
    }
  } catch (error) {
      return res.cookie('jwt', '', { expiresIn: '1d' }).redirect('/form-login')
  }
}*/

export {userAuth}