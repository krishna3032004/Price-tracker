// utils/scrapePrice.js
import puppeteer from 'puppeteer';

export const scrapePrice = async (url) => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Flipkart price selector (dynamic)
  const priceText = await page.$eval('div.Nx9bqj', el => el.innerText).catch(() => null);

  await browser.close();

  if (!priceText) return null;

  // Clean ₹ and commas
  const price = parseInt(priceText.replace(/[₹,]/g, ''));
  return isNaN(price) ? null : price;
};
