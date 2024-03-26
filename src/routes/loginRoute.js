import express from "express";
import * as loginController from "../app/controller/loginControllers.js"
const Route = express.Router()

Route.get("/",loginController.getLoginPage)

export default Route