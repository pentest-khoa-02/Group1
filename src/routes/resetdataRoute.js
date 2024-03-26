import express  from "express";
import * as resetdataControllers from "../app/controller/resetdataControllers.js"

const Route = express.Router()

Route.get("/",resetdataControllers.index)

export default Route
