import express from "express";
const Route = express.Router()
import * as pageController from "../app/controller/pageControllers.js"

Route.get("/",pageController.getPage)

export default Route