import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    if (mongoose.connections[0].readyState) {
      return true;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ اتصال به MongoDB موفقیت‌آمیز بود");
    return true;
  } catch (err) {
    console.error("❌ خطا در اتصال به MongoDB:", err.message);
    return false;
  }
};

export default connectToDB;