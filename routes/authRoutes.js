const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refreshToken,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/refresh-token", refreshToken);

router.get("/protected", protect, (req, res) => {
  res.json({ message: "Access granted", user: req.user });
});

module.exports = router;
