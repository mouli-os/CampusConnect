
const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema(
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

    registrationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from registering twice
eventRegistrationSchema.index(
  { student: 1, eventId: 1 },
  { unique: true }
);

const EventRegistration = mongoose.model(
  "EventRegistration",
  eventRegistrationSchema
);

module.exports = EventRegistration;
