import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const database = "mongodb+srv://krishna30mar:m3SVAAnWfHNkleNP@cluster0.zig2o.mongodb.net/price"
    console.log("aa rha kya")
    const conn = await mongoose.connect(`${database}`);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export default connectDB