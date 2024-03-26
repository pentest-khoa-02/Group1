import express from "express";
import * as timelinePageController from "../app/controller/timelinePageControllers.js"

const Route = express.Router()

Route.get('/',timelinePageController.getTimeLinePage)

export default Route