
const express = require("express");
const router = express.Router();

const EventRegistration = require("../models/EventRegistration");
const authMiddleware = require("../middleware/authMiddleware");
const events = require("../data/events");

// Register for an event
router.post("/:eventId/register", authMiddleware, async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);

    // Check whether the event exists
    const event = events.find((item) => item.id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Check whether the student has already registered
    const existingRegistration = await EventRegistration.findOne({
      student: req.user.id,
      eventId: eventId,
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event.",
      });
    }

    // Save registration in MongoDB
    const registration = await EventRegistration.create({
      student: req.user.id,
      eventId: event.id,
      eventTitle: event.title,
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered for the event!",
      data: registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already registered for this event.",
      });
    }

    console.error("Event registration error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to register for this event.",
    });
  }
});

module.exports = router;
