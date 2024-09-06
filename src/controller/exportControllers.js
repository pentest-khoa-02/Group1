import  service from "../service/renderPDF.js"
import { prisma } from "../config/prisma.js"
import {check_url_easy,check_url_medium,check_url_standard} from "../helper/validate/validate-url.js"
const getPdfPage = async(req,res) =>{
    let url = req.get("Referer")

    //level easy 
    const [setting] = await prisma.$queryRaw`Select status from vulnerable where name='SSRF'`
     
    
    let key, value
    if (req.headers.cookie){
      req.headers.cookie.split('; ').forEach(cookie => {
        const [k, v] = cookie.split('=');
        if (k === 'jwt')
        {
          key = k
          value = v
        }
      });
    }
   try {
    if(setting.status === 'Easy'){
        url = check_url_easy(url) ? url : "https://geekprank.com/hacker/"    
    }else if (setting.status == 'Medium') {
        url = check_url_medium(url)? url : "https://geekprank.com/hacker/"
    }else {
      url = check_url_standard(url)? url : "https://geekprank.com/hacker/"
    }
    const pdfBuffer  = await service.renderPDF(url,value)
    res.setHeader('Content-disposition', 'attachment; filename=profile.pdf');
    res.setHeader('Content-type', 'application/pdf');
    res.status(200)
    res.end(pdfBuffer);
   } catch (error) {
    res.status(500)
    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({
      error: {
        message: error.message
    }
    }))
    
    return;
   }
}
export default {getPdfPage}