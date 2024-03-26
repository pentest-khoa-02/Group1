import express from "express";
import * as messageController from "../app/controller/messageControllers.js"
const Route = express.Router()

Route.get("/",messageController.getMessagePage)

export default Route

