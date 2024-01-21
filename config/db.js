/* eslint-disable no-undef */
import mongoose from "mongoose";
const connectDB = async () => {
  const ENV = process.env.MONGO_URI;
  try {
    const conn = await mongoose.connect(ENV, {});
    console.log(
      `Mongo DB Connected ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (error) {
    console.log(`Error: ${error.message}`.red.bold);
    process.exit();
  }
};
export default connectDB;
