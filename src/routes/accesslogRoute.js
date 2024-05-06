import express from "express";
const Route = express.Router()
import accesslogController from "../controller/accesslogControllers.js"

Route.get("/",accesslogController.index)

export default Route