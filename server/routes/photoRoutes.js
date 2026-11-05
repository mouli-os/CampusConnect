
const express = require("express");
const router = express.Router();
const streamifier = require("streamifier");

const cloudinary = require("../config/cloudinary");
const CampusPhoto = require("../models/CampusPhoto");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const events = require("../data/events");

// Upload a campus photograph
router.post(
  "/upload",
  authMiddleware,
  upload.single("photo"),
  async (req, res) => {
    let uploadedImage;

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a photograph.",
        });
      }

      const caption = req.body.caption?.trim();

      if (!caption || caption.length > 250) {
        return res.status(400).json({
          success: false,
          message: "Caption is required and must be under 250 characters.",
        });
      }

      const eventId = req.body.eventId
        ? Number(req.body.eventId)
        : null;

      if (
        eventId !== null &&
        (!Number.isInteger(eventId) ||
          !events.some((event) => event.id === eventId))
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid event selected.",
        });
      }

      const event = eventId === null
        ? null
        : events.find((item) => item.id === eventId);

      uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "campusconnect",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

      const photo = await CampusPhoto.create({
        uploader: req.user.id,
        imageUrl: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
        caption,
        eventId,
        eventTitle: event ? event.title : "Campus Moments",
      });

      res.status(201).json({
        success: true,
        message: "Photograph uploaded successfully!",
        data: photo,
      });
    } catch (error) {
      if (uploadedImage?.public_id) {
        await cloudinary.uploader.destroy(uploadedImage.public_id);
      }

      console.error("Photo upload error:", error.message);

      res.status(500).json({
        success: false,
        message: "Unable to upload photograph.",
      });
    }
  }
);

// Get all campus photographs
router.get("/", async (req, res) => {
  try {
    const photos = await CampusPhoto.find()
      .populate("uploader", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to load campus photographs.",
    });
  }
});

// Get photographs for one event
router.get("/event/:eventId", async (req, res) => {
  try {
    const eventId = Number(req.params.eventId);

    const photos = await CampusPhoto.find({ eventId })
      .populate("uploader", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to load event photographs.",
    });
  }
});

module.exports = router;
