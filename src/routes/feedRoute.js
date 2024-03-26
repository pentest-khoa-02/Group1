import express from "express"
const Route = express.Router()
import * as homeController from "../app/controller/homeControllers.js"
Route.get("/",homeController.getHomePage)

export default Route