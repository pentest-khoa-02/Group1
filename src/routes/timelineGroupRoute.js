import express from "express";
import * as timelineGroupController from "../app/controller/timelineGroupControllers.js"

const Route = express.Router()

Route.get('/',timelineGroupController.getTimeLineGroupPage)

export default Route