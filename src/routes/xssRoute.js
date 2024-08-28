import express from "express";
import ejs from "ejs"
const Route = express.Router()

//test => SSTI and XSS => plaint text context 
Route.get('/',(req,res)=>{
  if(req.query.username){
    let html =  ejs.render(`<b>Hi ${req.query.username}</b>`)
    res.send(html)
  }
})

export default Route