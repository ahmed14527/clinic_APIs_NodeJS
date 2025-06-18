const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    const email = "admin@clinic.com";
    const plainPassword = "admin123";

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("❗ Admin already exists");
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created:", admin.email);
    process.exit();
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
});
