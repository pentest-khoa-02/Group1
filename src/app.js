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
import cors from 'cors'
const prisma = new PrismaClient()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const app = express()
const port = process.env.PORT || 3000

const uploadFolderPath = path.join(__dirname, '../uploads');
// Cấu hình express để phục vụ các tệp tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(uploadFolderPath));
//config view 
configViewEngine(app,__dirname)
initWebsocket()


//configuring cors dynamic Origin 
var corsOptions = {
  origin: 'http://localhost:8082' ,
  methods : ['GET' ,'POST','DELETE'],
  allowedHeaders : ['Content-Type'],
  credentials : true ,
  
}
//use cors
app.use(cors(corsOptions))

//get cookie
app.use(cookieParser());

//log 
const logMiddleware = (req, res, next) => {
    const now = new Date().toISOString();
    console.log(`[${now}] ${req.method} ${req.url}`);
    next(); // Chuyển tiếp yêu cầu tới middleware tiếp theo
  };
  
  // Sử dụng middleware
app.use(logMiddleware);
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