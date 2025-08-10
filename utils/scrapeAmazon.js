// import { load } from "cheerio";
// import axios from "axios";

// export async function scrapeAmazon(link) {
//   try {
//     const { data } = await axios.get(link, {
//       headers: {
//         "User-Agent": "Mozilla/5.0",
//       },
//     });

//     const $ = load(data);
//     const title = $("#productTitle").text().trim();
//     const image = $("#imgTagWrapperId img").attr("src");
//     const price = parseFloat($("#priceblock_ourprice, #priceblock_dealprice").text().replace(/[^0-9]/g, ''));

//     return {
//       title,
//       image,
//       currentPrice: price || 0,
//       mrp: price || 0,
//       lowest: price,
//       highest: price,
//       average: price,
//       discount: "0%",
//       rating: 4,
//       time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
//       platform: "amazon",
//       productLink: link,
//       amazonLink: link,
//       priceHistory: [
//         { price, date: new Date().toISOString().split("T")[0] },
//       ],
//       predictionText: "Prediction data not available yet.",
//     };
//   } catch (err) {
//     console.error("Amazon scrape error:", err);
//     return null;
//   }
// }











import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export async function scrapeAmazon(url) {
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

    // Wait for the product title
    await page.waitForSelector('#productTitle');

    const result = await page.evaluate(() => {
      const getText = (selector) => document.querySelector(selector)?.innerText.trim() || null;
      const getAttr = (selector, attr) => document.querySelector(selector)?.getAttribute(attr) || null;

      const title = getText('#productTitle');

      const priceWhole = getText('.a-price-whole')?.replace(/[^\d]/g, '');
      const currentPrice = priceWhole ? parseInt(priceWhole) : null;

      const mrpText = document.querySelector('.a-text-price .a-offscreen')?.innerText || '';
      const mrp = mrpText ? parseInt(mrpText.replace(/[^\d]/g, '')) : null;

      const discountText = getText('.savingsPercentage');
      const discountMatch = discountText?.match(/\d+/);
      const discount = discountMatch ? parseInt(discountMatch[0]) : null;

      const image = getAttr('#landingImage', 'src');

      return { title, currentPrice, mrp, discount, image };
    });

    await browser.close();


    // console.log(result)

    return {
      title: result.title,
      image: result.image,
      currentPrice: result.currentPrice,
      mrp: result.mrp,
      lowest: result.currentPrice,
      highest: result.currentPrice,
      average: result.currentPrice,
      discount: result.discount,
      rating: 4,
      time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      platform: "amazon",
      productLink: url,
      amazonLink: url,
      priceHistory: [
        { price: result.currentPrice, date: new Date().toLocaleDateString('en-CA') },
      ],
      predictionText: "Prediction data not available yet.",
    };

  } catch (err) {
    console.error("Amazon Puppeteer scrape error:", err);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
