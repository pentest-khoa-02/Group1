import express  from "express";
import * as videoWatchController from "../app/controller/video_watchControllers.js"
const Route = express.Router()

Route.get("/",videoWatchController.getVideo)

export default Route