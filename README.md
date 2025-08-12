# 📉 Price Tracker & Predictor

A full-stack **E-commerce Price Tracker** that allows users to search products, track price history, get **future price predictions** using Machine Learning, and receive **real-time drop chances** — all in one place.

---

## 🚀 Features

- **🔍 Product Search & Tracking**
  - Paste a product link (Amazon/Flipkart).
  - Or select from already tracked products.
  - If product exists in DB → fetch instantly.
  - If not → scrape details and save for future tracking.

- **⚡ Smart Scraping**
  - Uses **Puppeteer** to scrape product details and prices from Amazon & Flipkart.
  - Stores:
    - Current Price
    - Lowest Price
    - Highest Price

- **📈 Price History Visualization**
  - Interactive chart showing how the price has changed over time.
  - Automatically updates every 12 hours.

- **🤖 Machine Learning Prediction**
  - Uses **Facebook Prophet** (Python) to predict future prices.
  - Prediction includes:
    - `yhat` → Predicted price
    - `yhat_lower` → Minimum expected price
    - `yhat_upper` → Maximum expected price
  - Confidence intervals make predictions more realistic.

- **📊 Chances of Drop**
  - Calculates the probability (%) that the price will drop.
  - Small fluctuations are ignored for better accuracy.

- **💡 "Should You Buy?"**
  - Smart suggestion system based on:
    - Current price vs predicted drop.
    - Historical lows.

- **⏳ Automatic Price Updates**
  - GitHub Actions scheduler runs **every 12 hours** to scrape fresh prices for all tracked products.
  - No manual refresh needed.

---

## 🛠 Tech Stack

**Frontend:**
- Next.js
- Tailwind CSS
- Chart.js / Recharts

**Backend:**
- Node.js + Express
- MongoDB + Mongoose

**Machine Learning:**
- Python
- Facebook Prophet
- Pandas, NumPy

**Scraping:**
- Puppeteer
- Cheerio

**Automation:**
- GitHub Actions (Cron job every 12h)
- Nodemailer (Email alerts for drops)

---

## 📂 Project Workflow

1️⃣ **User enters a product link**  
   - If found in DB → Fetch data instantly.  
   - If not found → Scrape product details & store.

2️⃣ **Scraper fetches details**  
   - Extracts current, lowest, and highest price.
   - Saves in `priceHistory`.

3️⃣ **Prediction Engine runs**  
   - Sends price history to ML API (Python Prophet deployed on Render).
   - Gets:
     - Predicted price
     - Lower & upper bounds
     - Drop chance

4️⃣ **Frontend displays results**
   - **Price History Graph**
   - **Future Prediction Graph**
   - Drop chance & buy suggestion.

5️⃣ **Scheduler updates prices**
   - Every 12 hours, GitHub Action runs `updatePrices.js`.
   - Scrapes fresh data for all products in DB.
   - Sends email alerts for drops.

<!-- ---

## 📊 Example Prediction Data

| Date       | Actual Price | Predicted Price | Lower Bound | Upper Bound | Drop Chance |
|------------|--------------|----------------|-------------|-------------|-------------|
| 2025-08-10 | ₹2299        | ₹2100          | ₹2000       | ₹2200       | 78%         |
| 2025-08-11 | ₹2299        | ₹2150          | ₹2050       | ₹2250       | 73%         |
| 2025-08-12 | ₹2299        | ₹2200          | ₹2100       | ₹2300       | 72%         |

--- -->

## 📅 Scheduler (GitHub Actions)

- Runs every **12 hours**:
```yaml
on:
  schedule:
    - cron: "0 */12 * * *"
```    
## ⚙️ Executes
- **cron/updatePrices.js** – Scrapes fresh prices for all products and updates the database.
- **Email Alerts** – Sends notifications to users if a product’s price drops below their desired threshold.

---

## 🏗 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/yourusername/price-tracker.git
cd price-tracker
```


## 🚀 Installation & Setup

### 2️⃣ Install Dependencies

#### 📦 Frontend
```bash
npm install
```

## 📦 Backend
```bash
npm install

🤖 Python ML Model
```bash
pip install -r requirements.txt
```

3️⃣ Run Locally  

▶️ Frontend  
```bash
npm run dev
```

▶️ Backend  
```bash
node server.js
```

▶️ ML API  
```bash
python app.py
```




This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
