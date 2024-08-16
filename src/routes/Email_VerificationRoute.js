import express from "express";
import Email_VerController from "../controller/Email_VerController.js"
const Route = express.Router()

Route.get('/:token',Email_VerController.getEmail_VerPage)

export default Route