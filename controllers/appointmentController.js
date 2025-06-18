const AppointmentSlot = require("../models/AppointmentSlot");
const UrgentRequest = require("../models/UrgentRequest");
const sendEmail = require("../utils/sendEmail");

exports.getAvailableSlots = async (req, res) => {
  try {
    const slots = await AppointmentSlot.find({ isBooked: false }).sort("date");
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const slot = await AppointmentSlot.findById(req.params.slotId);

    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked)
      return res.status(400).json({ message: "Slot already booked" });

    slot.isBooked = true;
    slot.bookedBy = req.user._id;
    await slot.save();

    await sendEmail(
      req.user.email,
      "تم تأكيد حجزك في العيادة",
      `تم حجز ميعادك بنجاح يوم ${slot.date.toLocaleDateString()} الساعة ${
        slot.time
      }`
    );

    res.json({ message: "Appointment booked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.requestUrgentAppointment = async (req, res) => {
  const { reason, preferredDate } = req.body;
  try {
    const request = await UrgentRequest.create({
      patient: req.user._id,
      reason,
      preferredDate,
    });

    res.status(201).json({ message: "Urgent request sent", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSlot = async (req, res) => {
  const { date, time } = req.body;

  if (!date || !time) {
    return res.status(400).json({ message: "Both date and time are required" });
  }

  try {
    const combinedDateTime = new Date(`${date}T${time}:00`);

    const slot = await AppointmentSlot.create({
      date: combinedDateTime,
      time,
    });

    res.status(201).json({ message: "Slot created", slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUrgentRequests = async (req, res) => {
  try {
    const requests = await UrgentRequest.find().populate("patient", "email");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUrgentRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const request = await UrgentRequest.findById(id).populate("patient");

    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = status;
    await request.save();

    if (status === "accepted") {
      await sendEmail(
        request.patient.email,
        "تمت الموافقة على طلب الحجز المستعجل",
        "تمت الموافقة على طلبك المستعجل، وسيتم التواصل معك لتحديد الميعاد في أقرب وقت."
      );
    }

    res.json({ message: "Request updated", request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentSlot.find({
      bookedBy: req.user._id,
    }).sort("date");
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
