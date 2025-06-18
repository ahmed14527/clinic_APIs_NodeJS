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

/**
 * @swagger
 * /admin/slots:
 *   post:
 *     summary: Create a new appointment slot
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date
 *               - time
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-22"
 *               time:
 *                 type: string
 *                 example: "14:00"
 *     responses:
 *       201:
 *         description: Slot created successfully
 */
router.post("/slots", protect, isAdmin, createSlot);

/**
 * @swagger
 * /admin/urgent-requests:
 *   get:
 *     summary: Get all urgent appointment requests
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of urgent requests
 */
router.get("/urgent-requests", protect, isAdmin, getUrgentRequests);

/**
 * @swagger
 * /admin/urgent-requests/{id}:
 *   patch:
 *     summary: Update status of an urgent request (accept/reject)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [accepted, rejected]
 *     responses:
 *       200:
 *         description: Request updated
 */
router.patch(
  "/urgent-requests/:id",
  protect,
  isAdmin,
  updateUrgentRequestStatus
);

/**
 * @swagger
 * /admin/create-user:
 *   post:
 *     summary: Create a user (admin or doctor only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: "doctor@clinic.com"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *               role:
 *                 type: string
 *                 enum: [admin, doctor]
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/create-user", protect, isAdmin, createUserByAdmin);

module.exports = router;
