// cron/updatePrices.js
import mongoose from 'mongoose';
import Product from '@/models/Product';
import { scrapePrice } from '@/utils/scrapePrice';
import connectDB from '@/db/connectDB';
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: 'gmail', // you can change to Outlook, etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your app password
  },
});



export const updateProductPrices = async () => {

  await connectDB()

  const products = await Product.find();

  for (const product of products) {
    const latestDBPrice = product.priceHistory?.[product.priceHistory.length - 1]?.price;
    const currentPrice = await scrapePrice(product.productLink);

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
