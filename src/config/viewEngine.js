import express from "express"
import path from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import expressLayouts from "express-ejs-layouts"
import fs from 'fs'
import morgan from 'morgan'


const configViewEngine = (app,__dirname) => {
   
    app.use(express.json()) // for json
    app.use(express.urlencoded({ extended: true })) // for form data
    // config setting 
    app.set('views',path.join(__dirname,"views"))
    app.set('view engine', 'ejs')
    // static 
    app.use(express.static(path.join(__dirname,"public")))
    app.use(expressLayouts);
    app.set('layout', 'layouts/main');

    // exploit server
    var accessLogStream = fs.createWriteStream(path.join(__dirname, '/public/access.log'), { flags: 'a' })
    app.use(morgan('combined', { stream: accessLogStream }))
}

export default configViewEngine