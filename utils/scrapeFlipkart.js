// import { load } from "cheerio";
// import axios from "axios";

// export async function scrapeFlipkart(link) {
//     try {
//         const { data } = await axios.get(link, {
//             headers: {
//                 "User-Agent": "Mozilla/5.0",
//             },
//         });


//         const $ = load(data);

//         const title = $('span.VU-ZEz').text().trim();
//         const image = $('img.DByuf4').attr('src');
//         // const priceText =$('VU-ZEz')
//         // const priceText = $('div.Nx9bqj').text().trim();
//         // const price = priceText ? parseFloat(priceText) : null;


//         const mrpText = $('div.yRaY8j').first().text().trim() || null;
//         const mrpNumber = mrpText.replace(/[^\d]/g, ''); // Remove everything except digits
//         const mrp = mrpNumber ? parseInt(mrpNumber) : null;

//         const priceText = $('div.Nx9bqj').first().text().trim(); // e.g., "₹3,200"
//         const priceNumber = priceText.replace(/[^\d]/g, ''); // Remove everything except digits
//         const price = priceNumber ? parseInt(priceNumber) : null;


//         // const discountText = $('div.UkUFwK.WW8yVX.yKS4la span').first().text().trim(); // e.g., "34% off"
//         // const discountMatch = discountText.match(/\d+/); // Match first number in string
//         // const discount = discountMatch ? parseInt(discountMatch[0]) : null;

//         const discountText = $("div[class*='UkUFwK'] span").first().text().trim();
// const discountMatch = discountText.match(/\d+/);
// const discount = discountMatch ? parseInt(discountMatch[0]) : null;

//         // const price = priceText.replace(/[₹]/g, '').trim();  // "3299"
//         // const price = priceText.replace('₹', '').trim();

//         // if (!title || !image || !price) {
//         // console.log(image)
//         //     console.error("Scraper failed to extract one or more fields");
//         //     return null;
//         // }
//         // return null
//         return {
//             title,
//             image,
//             currentPrice: price || 0,
//             mrp: mrp || 0,
//             lowest: price,
//             highest: price,
//             average: price,
//             discount: discount,
//             rating: 4,
//             time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
//             platform: "flipkart",
//             productLink: link,
//             amazonLink: "",
//             priceHistory: [
//                 { price, date: new Date().toLocaleDateString('en-CA') },
//             ],
//             predictionText: "Prediction data not available yet.",
//         };
//     } catch (err) {
//         console.error("Flipkart scrape error:", err);
//         return null;
//     }
// }











export const runtime = "nodejs";

import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";

export async function scrapeFlipkart(url) {
 let browser = null;
   try {
    // const isDev = process.env.NODE_ENV === "development";

    // const executablePath = isDev
    //   ? "C:/Program Files/Google/Chrome/Application/chrome.exe"
    //   : await chromium.executablePath;

    // console.log("chromium.executablePath =", executablePath);

    // const launchOptions = {
    //   args: chromium.args,
    //   defaultViewport: chromium.defaultViewport,
    //   headless: chromium.headless,
    // };

    // if (executablePath) {
    //   launchOptions.executablePath = executablePath;
    // }

    const launchOptions = {
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  headless: chromium.headless,
};

// Agar chromium.executablePath null hai to launch without it
if (executablePath) {
  launchOptions.executablePath = executablePath;
}

browser = await puppeteer.launch(launchOptions);


    browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.waitForSelector('span.VU-ZEz');

    const result = await page.evaluate(() => {
      const title = document.querySelector('span.VU-ZEz')?.innerText.trim() || null;
      const image = document.querySelector('img.DByuf4')?.src || null;
      const mrpText = document.querySelector('div.yRaY8j')?.innerText || '';
      const mrp = parseInt(mrpText.replace(/[^\d]/g, '')) || null;
      const priceText = document.querySelector('div.Nx9bqj')?.innerText || '';
      const price = parseInt(priceText.replace(/[^\d]/g, '')) || null;
      const discountText = document.querySelector("div[class*='UkUFwK'] span")?.innerText || '';
      const discountMatch = discountText.match(/\d+/);
      const discount = discountMatch ? parseInt(discountMatch[0]) : null;

      return { title, image, mrp, price, discount };
    });

    // console.log(result.title)
    // console.log(result.image)
    // console.log(result.price)
    // console.log(result.mrp)
    // console.log(result.discount)

    await browser.close();


    return {
      title: result.title,
      image: result.image,
      currentPrice: result.price,
      mrp: result.mrp,
      lowest: result.price,
      highest: result.price,
      average: result.price,
      discount: result.discount,
      rating: 4,
      time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      platform: "flipkart",
      productLink: url,
      amazonLink: "",
      priceHistory: [
        { price: result.price, date: new Date().toLocaleDateString('en-CA') },
      ],
      predictionText: "Prediction data not available yet.",
    };

  } catch (err) {
    console.error("Flipkart Puppeteer scrape error:", err);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
