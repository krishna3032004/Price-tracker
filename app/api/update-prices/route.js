// app/api/update-prices/route.js (App Router)
import { updateProductPrices } from '@/cron/updatePrices';
import { NextResponse } from 'next/server';

export async function GET() {
  await updateProductPrices();
  return NextResponse.json({ message: 'Price check done ✅' });
}