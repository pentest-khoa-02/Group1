import express  from "express";
import * as timelineFundingController from "../app/controller/timelineFundingControllers.js"
const Route = express.Router()

Route.get('/',timelineFundingController.getTimelineFundingPage)

export default Route