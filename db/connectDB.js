import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("aa rha kya")
    const conn = await mongoose.connect(`${process.env.DATABASE_URL}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export default connectDB