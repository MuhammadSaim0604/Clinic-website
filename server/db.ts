import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer | null = null;

export async function connectDB() {
  if (mongoose.connection.readyState !== 0) return;
  
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to external MongoDB");
  } else {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log("Connected to in-memory MongoDB");
    // Ensure CLINIC_TYPE is respected in the DB if set in env
    if (process.env.CLINIC_TYPE) {
      console.log(`Environment locked to Clinic Type: ${process.env.CLINIC_TYPE}`);
    }
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
}
