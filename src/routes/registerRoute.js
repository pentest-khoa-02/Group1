import express from "express";
import * as registerControllers from "../app/controller/registerControllers.js";
const Route = express.Router();

/*Route.route("/")
    .get(registerControllers.getRegisterPage)
    .post(registerControllers.postRegisterPage);*/
Route.get("/",registerControllers.getRegisterPage);

export default Route;
