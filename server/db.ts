import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState !== 0) return;
  
  if (process.env.MONGO_URI) {
    console.log("connecting to db... wait")
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to external MongoDB");
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
