import express from "express";
import profileControllers from "../controller/profileControllers.js"
const Route = express.Router()

Route.get("/mytimeline", profileControllers.mytimeline)
Route.get("/logout", profileControllers.logout)
Route.get("/pagedata", profileControllers.pagedata)

export default Route