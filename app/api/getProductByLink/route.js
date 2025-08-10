import Product from "@/models/Product";
import connectDB from "@/db/connectDB";
import { scrapeAmazon } from "@/utils/scrapeAmazon";
import { scrapeFlipkart } from "@/utils/scrapeFlipkart";

export const runtime = "nodejs";

// Flipkart URL normalization function
function normalizeFlipkartURL(url) {
  try {
    const u = new URL(url);
    const pid = u.searchParams.get("pid");
    const basePath = u.origin + u.pathname;

    if (pid) {
      return `${basePath}?pid=${pid}`;
    }
    return basePath;
  } catch (err) {
    console.error("Invalid Flipkart URL:", url);
    return url;
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    let url = searchParams.get("url");

    if (!url) {
      return new Response(JSON.stringify({ error: "Product URL is required." }), { status: 400 });
    }

    // if (url.includes("dl.flipkart.com")) {
      // resolve karo
      // HEAD request to follow redirect
      const response = await fetch(url, {
        method: "GET",
        redirect: "follow"
      });

      // Final resolved URL after redirect
      url = response.url;
      // console.log(url)

    // } 

    // 2️⃣ Flipkart link ko normalize karo
    if (url.includes("flipkart.com")) {
      url = normalizeFlipkartURL(url);
    }
// 
    // 1. Check if product already exists in DB
    console.log(url)
    let product = await Product.findOne({ productLink: url });

    if (product) {
      return new Response(JSON.stringify(product), { status: 200 });
    }

    // 2. Determine platform and scrape accordingly
    let scrapedProduct = null;
    if (url.includes("amazon")) {
      scrapedProduct = await scrapeAmazon(url);
      console.log("aree aya ki nhi")
      console.log(scrapedProduct)
    } else if (url.includes("flipkart")) {
      scrapedProduct = await scrapeFlipkart(url);
    } else {
      return new Response(JSON.stringify({ error: "Only Amazon and Flipkart product links are supported." }), { status: 400 });
    }

    if (!scrapedProduct) {
      return new Response(JSON.stringify({ error: "Failed to fetch product details. Please check the URL." }), { status: 500 });
    }

    // 3. Save the newly scraped product to DB
    const newProduct = await Product.create(scrapedProduct);
    return new Response(JSON.stringify({ error: "Product was not previously tracked. It has now been added for tracking." }), { status: 500 });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error. Please try again later." }), { status: 500 });
  }
}