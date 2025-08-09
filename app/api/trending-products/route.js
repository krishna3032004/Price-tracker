import { NextResponse } from 'next/server';
import connectDB from '@/db/connectDB';
import Product from '@/models/Product';

export async function GET() {
  await connectDB();

  // Top 10 products with most recent price updates or highest price drop etc.
  const trendingProducts = await Product.find()
    .sort({ 'priceHistory.0.date': -1 }) // sort by most recent price update
    .limit(10);

  return NextResponse.json(trendingProducts);
}
