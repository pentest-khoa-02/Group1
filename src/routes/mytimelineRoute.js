import express  from "express";
import timelineController from "../controller/timelineControllers.js"
const Route = express.Router()

Route.get("/",timelineController.index)

export default Route