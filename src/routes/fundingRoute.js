import express from "express";
const Route = express.Router()
import * as fundingController from "../app/controller/fundingControllers.js"

Route.get("/",fundingController.getFundingPage)

export default Route