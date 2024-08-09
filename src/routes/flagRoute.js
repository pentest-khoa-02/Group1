import express from "express";
const Route = express.Router()

Route.all('/', async (req,res) => {
    console.log(req.body)
    console.log( req.headers['x-real-ip'])
    
    if(req.headers['x-real-ip'] != "127.0.0.1"){
      return  res.send('oh no !!')
    }
    // console.log('G1{Th!s_!s_F@KE_Fl@g}')   
    // return res.send('successfully')
    
    
   
})

export default Route