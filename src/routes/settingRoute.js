import express  from "express";
import settingController from "../controller/settingControllers.js"
import multer from "multer"
import { prisma } from "../config/prisma.js";
const Route = express.Router()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log(file)
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `${decodeURIComponent(file.originalname)}`);
    }
  });
async function checkFileType(file,cb){
  //easy 
   const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='File Upload Vuls'`
   if(setting.status == 'Easy'){
    const fileTypes = /(jpeg|jpg|png)$/
    const mimetype  =  fileTypes.test(file.mimetype)
    if(mimetype){
        return cb(null,true)
    }else {
      const error = new Error('Only image/jpg , image/jpeg and image/png files are allowed!');
      error.code = 'Only image/jpg , image/jpeg and image/png files are allowed!';
      cb(error,false)
    }
   }else if (setting.status == 'Medium'){
      const fileTypes = /(jpeg|jpg|png)$/
      const original_type = file.originalname.split('.')[1] ;  
      const type  =  fileTypes.test(original_type)
      if(type){
          return cb(null,true)
      }else {
        const error = new Error('Only .jpg , jpeg and .png files are allowed!');
        error.code = 'Only .jpg , jpeg and .png files are allowed!';
        cb(error,false)
      }
   }else {
    const fileTypes = /(jpeg|jpg|png)$/
      const original_type = file.originalname.split('.')[file.originalname.split('.').length - 1]
      const type  =  fileTypes.test(original_type)
      if(type){
          return cb(null,true)
      }else {
        const error = new Error('Only .jpg , jpeg and .png files are allowed!');
        error.code = 'Only .jpg , jpeg and .png files are allowed!';
        cb(error,false)
      }
   }
}
const upload = multer({ storage: storage,
  fileFilter : function (req,file,cb) {
      checkFileType(file,cb)
  },
  limits: {
    fileSize :  2 * 1024 * 1024, //2MB
    files : 1
  }
 });
Route.get("/",settingController.getSettingPage)
Route.post("/",settingController.postSettingPage)
Route.post("/upload-avatar",settingController.uploadAvatar)
Route.post("/upload-file",upload.single('file'),function(err,req,res,next){
  if(err){
    return res.status(200).send(JSON.stringify(err))
   }else {
    next()
   }
  
},settingController.uploadfie)

export default Route