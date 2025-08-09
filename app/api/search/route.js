import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import connectDB from '@/db/connectDB';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

   // Split the query into individual words
   const words = query?.split(' ').filter(Boolean) || [];

   // Create regex-based conditions for each word
   const regexConditions = words.map((word) => ({
     title: { $regex: word, $options: 'i' },
   }));
 
   // Use $and to make sure all words match somewhere in title
   const products = await Product.find({
     $and: regexConditions,
   });

//   const products = await Product.find({
//     title: { $regex: query, $options: 'i' }
//   });

  return NextResponse.json(products);
}
