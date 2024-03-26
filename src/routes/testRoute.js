import express  from "express";
import * as testController from "../app/controller/testControllers.js"
const Route = express.Router()

Route.get("/",testController.index)

export default Route