// import mongoose from 'mongoose'

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URL)
//     console.log(`MongoDB connected : ${conn.connection.host}`);
//   } catch (error) {
//     console.log(`Error :: MongoDB connection :: `, error);
//   }
// }
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Error :: MongoDB connection ::", error.message);
    process.exit(1); // Stop server if DB fails
  }
};