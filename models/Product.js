import mongoose from "mongoose";

const priceHistorySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: String, // Can also use `Date` type if you're storing actual Date objects
    required: true,
  },
});

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  lowest: {
    type: Number,
    required: true,
  },
  highest: {
    type: Number,
    required: true,
  },
  average: {
    type: Number,
  },
  discount: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
  },
  time: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ["flipkart", "amazon", "myntra", "other"], // you can add more
    required: true,
  },
  productLink: {
    type: String,
    required: true,
  },
  amazonLink: {
    type: String,
  },
  notify: [
    {
      name: String,
      email: String,
    }
  ],
  priceHistory: {
    type: [priceHistorySchema],
    default: [],
  },
  predictionText: {
    type: String,
    required: false,
  },
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
