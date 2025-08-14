// app/api/update-prices/route.js (App Router)
// import { updateProductPrices } from '@/cron/updatePrices';
import { updatePrices } from '@/cron/updatePrices';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  await updatePrices();
  return NextResponse.json({ message: 'Price check done ✅' });
}