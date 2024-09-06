import puppeteer from "puppeteer"

const renderPDF  = async (url,token) => {
   try {
    const browser = await puppeteer.launch({ ignoreHTTPSError: true, args: ['--no-sandbox']});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "ngrok-skip-browser-warning": "true"
    });
    let cookies = [
      {   
         "name" :"jwt",
         "value" :token,
         "domain" : "web-vul.com",
          path: '/', // specify the path of the cookie
         httpOnly: true, // make the cookie accessible only through the HTTP protocol
         // secure: true // make the cookie accessible only via HTTPS
      }
    ]
    await page.setCookie(...cookies)
    await page.goto(url);
    await page.setViewport({width: 1080, height: 1024});
    let pdf = await page.pdf({
      format: 'A4',
    });
    
    await browser.close();
    return pdf
   } catch (error) {
    console.log(error)
      throw error;
   }
  };

  export default {renderPDF}