
const express = require("express");
const router = express.Router();

const EventReview = require("../models/EventReview");
const authMiddleware = require("../middleware/authMiddleware");
const events = require("../data/events");

// Submit an event review
router.post("/:eventId", authMiddleware, async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);
    const { rating, comment } = req.body;

    // Check whether the event exists
    const event = events.find((item) => item.id === eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    // Validate rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // Validate comment
    if (
      typeof comment !== "string" ||
      comment.trim().length < 5 ||
      comment.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message: "Review must contain 5 to 1000 characters.",
      });
    }

    const review = await EventReview.create({
      student: req.user.id,
      eventId,
      eventTitle: event.title,
      rating,
      comment: comment.trim(),
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully!",
      data: review,
    });
  } catch (error) {
    // Handle duplicate reviews
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this event.",
      });
    }

    console.error("Review submission error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to submit review.",
    });
  }
});

// Get all reviews for an event
router.get("/:eventId", async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);

    if (!Number.isInteger(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID.",
      });
    }

    const reviews = await EventReview.find({ eventId })
      .populate("student", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating: Number(averageRating.toFixed(1)),
      data: reviews,
    });
  } catch (error) {
    console.error("Review fetching error:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load reviews.",
    });
  }
});

module.exports = router;
