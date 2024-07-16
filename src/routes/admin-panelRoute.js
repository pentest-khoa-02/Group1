import express  from "express";
import adminMiddleware from "../middleware/isAdmin.js"
import adminController from "../controller/adminController.js";
import { prisma } from "../config/prisma.js";
const Route = express.Router()

//check setting 
try {
    const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='Broken Authentication'`
    if (setting.status == 'Easy'){
        Route.get('/users/delete',adminController.deleteUser)
    }else {
        Route.get('/users/delete',adminMiddleware.checkisAdmin,adminController.deleteUser)
    }
} catch (error) {
    
}

Route.get('/',adminMiddleware.checkisAdmin,adminController.getAdminPage)

export default Route