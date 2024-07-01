import express from "express"
import configViewEngine from "./config/viewEngine.js"
import Route from "./routes/index.js"
import 'dotenv/config'
import { fileURLToPath } from 'url'
import { get404page } from './middleware/404.js'
import { userAuth } from './middleware/userAuth.js'
import path from "path"
import methodOverride from "method-override"
import cookieParser from 'cookie-parser';
import { pagedata } from './config/pagedata.js'
import initWebsocket from "./config/websocket.js"
import { csrfProtection } from './middleware/csrfProtection.js'
import {PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 3000

//config view 
configViewEngine(app,__dirname)
initWebsocket()
//get cookie
app.use(cookieParser());

//authen middleware
app.use(userAuth)
app.use(pagedata)

app.use(methodOverride('_method'))

//route
app.use("/",Route)

//handl 404 not found 
app.use(get404page)
console.log(import.meta.url)

//bind 
app.listen(port, () => console.info(`App listening on http://localhost:${port}!!`))