import express from "express";
import blogReadController from "../controller/blogReadControllers.js"
import handlerController from "../controller/commentpostControllers.js"
const Route = express.Router()
 Route.get('/',blogReadController.getBlogReadPage)
 Route.post('/comment',blogReadController.forwardRequestCommand)
 Route.post('/handlecomment',handlerController.handleComment)

 export default Route