
const mongoose = require("mongoose");

const campusPhotoSchema = new mongoose.Schema(
  {
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      required: true,
      trim: true,
      maxlength: 250,
    },

    eventId: {
      type: Number,
      default: null,
    },

    eventTitle: {
      type: String,
      default: "Campus Moments",
    },
  },
  {
    timestamps: true,
  }
);

const CampusPhoto = mongoose.model(
  "CampusPhoto",
  campusPhotoSchema
);

module.exports = CampusPhoto;
