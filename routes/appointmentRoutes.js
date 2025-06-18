const express = require("express");
const router = express.Router();

const {
  getAvailableSlots,
  bookSlot,
  requestUrgentAppointment,
  getUserAppointments,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

/**
 * @swagger
 * /appointments/slots:
 *   get:
 *     summary: Get all available appointment slots
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: List of available slots
 */
router.get("/slots", getAvailableSlots);

/**
 * @swagger
 * /appointments/book/{slotId}:
 *   post:
 *     summary: Book a specific appointment slot
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slotId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment booked successfully
 *       404:
 *         description: Slot not found
 *       400:
 *         description: Slot already booked
 */
router.post("/book/:slotId", protect, bookSlot);

/**
 * @swagger
 * /appointments/urgent-request:
 *   post:
 *     summary: Request an urgent appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "ألم شديد في الأسنان"
 *               preferredDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-06-21"
 *     responses:
 *       201:
 *         description: Urgent request sent
 */
router.post("/urgent-request", protect, requestUrgentAppointment);

/**
 * @swagger
 * /appointments/my-appointments:
 *   get:
 *     summary: Get all appointments booked by the logged-in user
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user appointments
 */
router.get("/my-appointments", protect, getUserAppointments);

module.exports = router;
