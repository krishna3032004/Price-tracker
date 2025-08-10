// utils/scrapePrice.js
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export const scrapePrice = async (url) => {
  let browser; // ✅ Declare outside so finally works

  try {
    const executablePath = await chromium.executablePath;

    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath, // ✅ Always use chromium path
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Flipkart price selector (dynamic)
    const priceText = await page.$eval('div.Nx9bqj', el => el.innerText).catch(() => null);

    await browser.close();

    if (!priceText) return null;

    // Clean ₹ and commas
    const price = parseInt(priceText.replace(/[₹,]/g, ''));
    return isNaN(price) ? null : price;

  } catch (err) {
    console.error("Flipkart Puppeteer scrape error:", err);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
