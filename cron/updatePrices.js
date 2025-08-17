// cron/updatePrices.js
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import connectDB from '../db/connectDB.js';
import nodemailer from "nodemailer"
import { fetch, Agent } from "undici";

const agent = new Agent({
  headersTimeout: 300_000, // 2 min
  bodyTimeout: 300_000,    // 2 min
});

const transporter = nodemailer.createTransport({
  service: 'gmail', // you can change to Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});

const SCRAPER_API_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL;


export const updatePrices = async () => {

  await connectDB()
  console.log("abhe chla ki nhi")

  const products = await Product.find();
  // / Prepare array of URLs for scraper API
  // const urls = products.map(p => p.productLink);
  const urls = products.map(p => ({ productLink: p.productLink }));
  // const urls = [
  //   { productLink: "https://www.amazon.in/dp/B0F4N3T2PH" },
  //   { productLink: "https://www.flipkart.com/jbl-tune-520-bt-57hr-playtime-pure-bass-multi-connect-5-3le-bluetooth/p/itm4b198abbdbe24?pid=ACCGQZVZ4ZQZKZYP" },
  // ];
  // Hit scraper API with URLs array
  // const chunkArray = (arr, size) =>
  //   arr.reduce((acc, _, i) =>
  //     (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

  // const chunks = chunkArray(products, 5);

  // for (const batch of chunks) {
  //   const response = await fetch(`${SCRAPER_API_URL}/api/scrape-prices`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ urls: batch.map(p => ({ productLink: p.productLink })) }),
  //   });

  //   if (!response.ok) {
  //     console.error('Failed to fetch prices from scraper API');
  //     return;
  //   }
  //   // const data = await response.json();
  //   console.log("Batch result:", data);
  // }
  const response = await fetch(`${SCRAPER_API_URL}/api/scrape-prices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ urls }),
    dispatcher: agent
  });

  if (!response.ok) {
    console.error('Failed to fetch prices from scraper API');
    return;
  }
  const jsonResponse = await response.json();
  console.log(jsonResponse); // Pure response dekhne ke liye

  const scrapedPrices = jsonResponse.results; // yeh sahi property hai
  console.log(scrapedPrices);


  for (const product of products) {
    const scrapedData = scrapedPrices.find(sp => sp.url === product.productLink);
    if (!scrapedData) {
      console.log(`No price data for ${product.title}`);
      continue;
    }
    const latestDBPrice = product.priceHistory?.[product.priceHistory.length - 1]?.price;
    const currentPrice = scrapedData.price;

    console.log(`Checking: ${product.name} - DB: ${latestDBPrice}, Now: ${currentPrice}`);

    if (currentPrice && currentPrice !== latestDBPrice) {



      product.priceHistory.push({ price: currentPrice, date: new Date() });

      // ✅ Update currentPrice
      product.currentPrice = currentPrice;

      // ✅ Update lowestPrice if needed
      if (!product.lowestPrice || currentPrice < product.lowestPrice) {
        product.lowestPrice = currentPrice;
      }

      // ✅ Update highestPrice if needed
      if (!product.highestPrice || currentPrice > product.highestPrice) {
        product.highestPrice = currentPrice;
      }

      await product.save();
      // 📩 Send email if price dropped
      if (currentPrice < latestDBPrice) {
        const interestedUsers = product.notify;

        if (interestedUsers.length > 0) {
          const mailPromises = interestedUsers.map(user =>
            transporter.sendMail({
              from: `"Price Drop Alert" <${process.env.EMAIL_USER}>`,
              to: user.email,
              subject: `Price Drop Alert: ${product.title}`,
              html: `
                <h2>Good news! 🎉</h2>
                <p>The price of <strong>${product.title}</strong> has dropped from <s>₹${latestDBPrice}</s> to <strong>₹${currentPrice}</strong>.</p>
                <p><a href="${product.productLink}" target="_blank">Click here to buy now</a></p>
              `,
            })
          );

          await Promise.all(mailPromises);
          console.log(`📩 Price drop emails sent to ${interestedUsers.length} users for ${product.name}`);
        }
      }
      console.log(`✅ Price updated for ${product.title}`);
    } else {
      console.log(`ℹ️ No change for ${product.title}`);
    }
  }

};


// Call the function if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updatePrices()
    .then(() => {
      console.log("✅ Price update script finished");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Error running updatePrices:", err);
      process.exit(1);
    });
}