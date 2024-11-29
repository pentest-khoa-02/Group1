import express from "express";
const Route = express.Router()
import statuspostController from "../controller/statuspostControllers.js"

Route.get("/",statuspostController.getStatusPage)
Route.get("/file",statuspostController.fileXml)

export default Route