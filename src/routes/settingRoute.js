import express  from "express";
import * as settingController from "../app/controller/settingControllers.js"
const Route = express.Router()

Route.get("/",settingController.getSettingPage)

export default Route