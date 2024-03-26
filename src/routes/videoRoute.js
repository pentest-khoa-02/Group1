import express  from "express";
const Route = express.Router()
import * as videoController from "../app/controller/videoControllers.js"

Route.get("/",videoController.getVideoPage)

export default Route

