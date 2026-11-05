
const mongoose = require("mongoose");

const eventReviewSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    eventId: {
      type: Number,
      required: true,
    },

    eventTitle: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// One review per student for each event
eventReviewSchema.index(
  { student: 1, eventId: 1 },
  { unique: true }
);

const EventReview = mongoose.model(
  "EventReview",
  eventReviewSchema
);

module.exports = EventReview;
