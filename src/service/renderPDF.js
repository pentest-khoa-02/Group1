import puppeteer from "puppeteer"

const renderPDF  = async (url) => {
   try {
    const browser = await puppeteer.launch({ ignoreHTTPSErrors: true});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "ngrok-skip-browser-warning": "true",
      "Cookie" : "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJraGFuaGR6IiwiaWF0IjoxNzE0ODMzNjE4LCJleHAiOjE3MTUyNjU2MTh9.Eyk5Ax24h5zQBsYaw-Am458CERLPlI5hmXAfNT-iYxM"
    });
    // const cookie = {
    //   name: 'jwt',
    //   value: 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJraGFuaGR6IiwiaWF0IjoxNzE0ODMzNjE4LCJleHAiOjE3MTUyNjU2MTh9.Eyk5Ax24h5zQBsYaw-Am458CERLPlI5hmXAfNT-iYxM',
    //   domain: 'localhost:3000',
    //   path: '/',
    //   // expires: Math.floor(Date.now() / 1000) + (60 * 60), // Set cookie expiry time (1 hour from now)
    //   httpOnly: true, // This cookie is accessible only via HTTP(S) requests
    //   secure: false // This cookie is only sent over secure connections (HTTPS)
    // };
  
    // Set the cookie
    // await page.setCookie("jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJraGFuaGR6IiwiaWF0IjoxNzE0ODMzNjE4LCJleHAiOjE3MTUyNjU2MTh9.Eyk5Ax24h5zQBsYaw-Am458CERLPlI5hmXAfNT-iYxM");
    url = 'https://webhook.site/ef25db63-2fb1-4961-8eec-8e75d4dff6df'
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.setViewport({width: 1080, height: 1024});
    let pdf = await page.pdf({format: 'A4'});
    
    await browser.close();
    return pdf
   } catch (error) {
      throw error;
   }
  };

  export default {renderPDF}