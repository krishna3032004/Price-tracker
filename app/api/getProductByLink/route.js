import Product from "@/models/Product";
import connectDB from "@/db/connectDB";
import { Ultra } from "next/font/google";

export const runtime = "nodejs";


function normalizeAmazonURL(url) {
  try {
    const u = new URL(url);
    // Amazon ASIN regex - usually 10 characters, letters+digits
    const asinMatch = u.pathname.match(/\/(dp|gp\/product)\/([A-Z0-9]{10})/i);
    if (asinMatch && asinMatch[2]) {
      return `https://www.amazon.in/dp/${asinMatch[2]}`;
    }
    return url;
  } catch {
    return url;
  }
}

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


const SCRAPER_SERVER_URL = process.env.NEXT_PUBLIC_SCRAPER_API_URL;
// const SCRAPER_SERVER_URL = "https://scrap-product-server.onrender.com/scrape";

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
    } else if (url.includes("amazon")) {
      url = normalizeAmazonURL(url);
      console.log(url)
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
    if (url.includes("amazon") || url.includes("flipkart")) {
      // scrapedProduct = await scrapeAmazon(url)

      const scrapeResponse = await fetch(`${SCRAPER_SERVER_URL}/scrape?url=${encodeURIComponent(url)}`);
      console.log(scrapeResponse)
      if (!scrapeResponse.ok) {
        return new Response(
          JSON.stringify({ error: "Failed to scrape product." }),
          { status: scrapeResponse.status }
        );
      }

      scrapedProduct = await scrapeResponse.json();
    } else {
      return new Response(JSON.stringify({ error: "Only Amazon and Flipkart product links are supported." }), { status: 400 });
    }


    // Call scraping server for scraping
    // const scrapeResponse = await fetch(`${SCRAPER_SERVER_URL}?url=${encodeURIComponent(url)}`);
    // if (!scrapeResponse.ok) {
    //   return new Response(
    //     JSON.stringify({ error: "Failed to scrape product." }),
    //     { status: scrapeResponse.status }
    //   );
    // }

    // scrapedData = await scrapeResponse.json();

    if (!scrapedProduct) {
      return new Response(JSON.stringify({ error: "Failed to fetch product details. Please check the URL." }), { status: 500 });
    }

    if (!scrapedProduct.success) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch product details. Please check the URL." }), { status: 500 });
    }
    // 3. Save the newly scraped product to DB
    // const newProduct = await Product.create(scrapedProduct);
    // Save scraped data to DB
    const newProduct = await Product.create({
      ...scrapedProduct.data,
      productLink: url,
      time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      platform: url.includes("amazon") ? "amazon" : "flipkart",
    });
    return new Response(JSON.stringify({ error: "Product was not previously tracked. It has now been added for tracking." }), { status: 500 });
  } catch (error) {
    console.error("API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error. Please try again later." }), { status: 500 });
  }
}