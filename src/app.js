import express from "express"
import configViewEngine from "./config/viewEngine.js"
import Route from "./routes/index.js"
import 'dotenv/config'
import bodyParser from "body-parser"
import { fileURLToPath } from 'url'
import { get404page } from './middleware/404.js'
import path from "path"
import bcrypt from "bcryptjs/dist/bcrypt.js"
import methodOverride from "method-override"
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 3000

//config view 
configViewEngine(app,__dirname)

app.use(methodOverride('_method'))

//get cookie
app.use(cookieParser());

//route
app.use("/",Route)

//handl 404 not found 
app.use(get404page)

//bind 
app.listen(port, () => console.info(`App listening on http://localhost:${port}!!`))
