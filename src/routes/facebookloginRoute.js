import express  from "express";
const Route = express.Router()
import facebookloginController from "../controller/facebookloginController.js";
Route.get('/',facebookloginController.handerLogin)

export default Route