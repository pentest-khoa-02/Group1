import puppeteer from "puppeteer"

const renderPDF  = async (url) => {
   try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.setViewport({width: 1080, height: 1024});
   let pdf = await page.pdf({format: 'A4'});

    await browser.close();
    return pdf
   } catch (error) {
      throw error;
   }
  };

  export {renderPDF}