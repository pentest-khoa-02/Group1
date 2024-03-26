import express from "express";
const Route = express.Router()
import * as eventControllers from "../app/controller/eventControllers.js"
Route.get("/",eventControllers.getEventPage)

export default Route