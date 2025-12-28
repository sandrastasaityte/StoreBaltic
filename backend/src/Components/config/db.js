import mongoose from "mongoose";

export default async function connectDB(MONGO_URL) {
  if (!MONGO_URL) throw new Error("MONGO_URL is missing in .env");

  mongoose.set("strictQuery", true);
  await mongoose.connect(MONGO_URL);
  console.log("✅ MongoDB connected");
}
