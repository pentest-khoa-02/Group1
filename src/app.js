import express from "express"
import configViewEngine from "./config/viewEngine.js"
import Route from "./routes/index.js"
import 'dotenv/config'
import bodyParser from "body-parser"
import { fileURLToPath } from 'url'
import { get404page } from './middleware/404.js'
import { userAuth } from './middleware/userAuth.js'
import path from "path"
import bcrypt from "bcryptjs/dist/bcrypt.js"
import methodOverride from "method-override"
import cookieParser from 'cookie-parser';
import { pagedata } from './config/pagedata.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 3000

//config view 
configViewEngine(app,__dirname)

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

//bind 
app.listen(port, () => console.info(`App listening on http://localhost:${port}!!`))