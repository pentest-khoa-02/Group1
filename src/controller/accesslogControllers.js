import fs from 'fs'
import path from "path"
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const index = (req,res) =>{
    res.render('access-log', {layout: false, accessLog: fs.readFileSync(path.join(__dirname, '../public/access.log'), 'utf8') })
}

export default {index}