const mongoose = require("mongoose");
const dotenv = require("dotenv");
const readline = require("readline");
const User = require("./models/User");

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (q) => new Promise((res) => rl.question(q, res));

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = await ask("Enter admin email: ");
    const password = await ask("Enter admin password: ");
    const firstName = await ask("Enter first name: ");
    const lastName = await ask("Enter last name: ");
    const phone = await ask("Enter phone number: ");

    const exists = await User.findOne({ email });
    if (exists) {
      console.log("❌ Admin user already exists with this email.");
      process.exit(0);
    }

    const admin = new User({
      email,
      password,
      role: "admin",
      firstName,
      lastName,
      phone,
    });

    await admin.save();
    console.log("✅ Admin user created successfully!");
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    rl.close();
    mongoose.disconnect();
  }
})();
