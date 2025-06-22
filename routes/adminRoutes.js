const express = require("express");
const router = express.Router();
const { createUserByAdmin } = require("../controllers/adminController");
const {
  createSlot,
  getUrgentRequests,
  updateUrgentRequestStatus,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

const { adminCreateUserValidator } = require("../middleware/validators");
const validate = require("../middleware/validateResult");

router.post("/slots", protect, isAdmin, createSlot);

router.get("/urgent-requests", protect, isAdmin, getUrgentRequests);
router.post("/create-user", protect, isAdmin, createUserByAdmin);

router.patch(
  "/urgent-requests/:id",
  protect,
  isAdmin,
  updateUrgentRequestStatus
);

router.post(
  "/create-user",
  protect,
  isAdmin,
  adminCreateUserValidator,
  validate,
  createUserByAdmin
);

module.exports = router;
