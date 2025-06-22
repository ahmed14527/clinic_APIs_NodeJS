const User = require("../models/User");

exports.createUserByAdmin = async (req, res) => {
  const { email, password, role, firstName, lastName, phone } = req.body;

  if (!["admin", "doctor"].includes(role)) {
    return res.status(400).json({ message: "❌ Invalid role" });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "❌ User already exists" });

    const user = new User({
      email,
      password,
      role,
      firstName,
      lastName,
      phone,
    });
    await user.save();

    res.status(201).json({
      message: `✅ ${role} account created successfully`,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
