import express from "express";
import RegisterController from "../controller/RegisterController.js"
const Route = express.Router()


Route.get('/',RegisterController.getPageRegister)
Route.post('/',RegisterController.handleRegister)

export default Route