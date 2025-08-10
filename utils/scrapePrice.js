// utils/scrapePrice.js
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export const scrapePrice = async (url) => {
  let browser;
  try {
    // Vercel AWS Lambda Environment hai to yeh config use hoga
    const isLambda = !!process.env.AWS_LAMBDA_FUNCTION_VERSION;

    browser = await puppeteer.launch(
      isLambda
        ? {
          args: chromium.args,
          executablePath:
            process.env.NODE_ENV === "production"
              ? await chromium.executablePath
              : puppeteer.executablePath(),
          headless: true,
        }
        : {
          headless: true, // Local development ke liye
        }
    );
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
