import express, { json }  from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
const Route = express.Router()

//update admin internal 
Route.all('/', async (req,res) => {
    console.log(req.body)
    console.log( req.headers['x-real-ip'])
    if(req.headers['x-real-ip'] != "127.0.0.1"){
      return  res.json({"Description" : "The function is only accessible through the internal network and is used to update admin privileges for other users."})
    }
    else{
        //handle update admin
        console.log('work')
        const id  = req.body.id || req.query.id
        if(id){
          const result = await prisma.user_role.create({
            data : {
              user_id : Number(id) ,
              role_id : 1
            }
          })
           return res.json(result)
        }

    }
    
    
    
})

export default Route