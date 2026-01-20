import mongoose from "mongoose";

mongoose.set("strictQuery", false);

export const connToDB = async () => {
  try {
    const dbInstance = await mongoose.connect(process.env.MONGO_URI!);
    console.log("DB connected successfully:", dbInstance.connection.host);
  } catch (error) {
    console.log("Error in connecting db", error);
  }
};
