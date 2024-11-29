import express from "express";
const Route = express.Router()
import registerController from "../controller/registerControllers.js"

Route.get("/",registerController.getRegisterPage)
Route.post("/",registerController.handleRegister)
Route.post("/check-email",registerController.checkemail)

export default Route