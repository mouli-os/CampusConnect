


import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./EventDetails.css";

function EventDetails() {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [registering, setRegistering] = useState(false);
  const [message, setMessage] = useState("");

  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMessage, setPhotoMessage] = useState("");

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [averageRating, setAverageRating] = useState(0);

  const token = sessionStorage.getItem("token");

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/events"
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error("Unable to load event.");
        }

        const selectedEvent = result.data.find(
          (item) => String(item.id) === id
        );

        if (!selectedEvent) {
          throw new Error("Event not found.");
        }

        setEvent(selectedEvent);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Fetch event photographs
  const fetchPhotos = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/photos/event/${id}`
      );

      const result = await response.json();

      if (result.success) {
        setPhotos(result.data);
      }
    } catch (error) {
      console.error("Unable to load event photos:", error);
    }
  };

  // Fetch event reviews
  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/reviews/${id}`
      );

      const result = await response.json();

      if (result.success) {
        setReviews(result.data);
        setAverageRating(result.averageRating);
      }
    } catch (error) {
      console.error("Unable to load event reviews:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchReviews();
  }, [id]);

  // Register for event
  const handleRegister = async () => {
    setRegistering(true);
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${id}/register`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed.");
      }

      setMessage(result.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setRegistering(false);
    }
  };

  // Upload event photograph
  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    setPhotoMessage("");

    if (!selectedFile) {
      setPhotoMessage("Please select a photograph.");
      return;
    }

    if (!caption.trim()) {
      setPhotoMessage("Please enter a caption.");
      return;
    }

    const formData = new FormData();

    formData.append("photo", selectedFile);
    formData.append("caption", caption.trim());
    formData.append("eventId", id);

    try {
      setUploadingPhoto(true);

      const response = await fetch(
        "http://localhost:5000/api/photos/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Photo upload failed.");
      }

      setPhotoMessage("Photograph uploaded successfully!");
      setCaption("");
      setSelectedFile(null);
      e.target.reset();

      await fetchPhotos();
    } catch (error) {
      setPhotoMessage(error.message);
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Submit event review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewMessage("");

    if (comment.trim().length < 5) {
      setReviewMessage("Your review must contain at least 5 characters.");
      return;
    }

    try {
      setSubmittingReview(true);

      const response = await fetch(
        `http://localhost:5000/api/reviews/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: Number(rating),
            comment: comment.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to submit review.");
      }

      setReviewMessage("Your review has been submitted!");
      setComment("");
      setRating(5);

      await fetchReviews();
    } catch (error) {
      setReviewMessage(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="event-details-page">
      <Link to="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      {/* Event Information */}
      <div className="event-details-card">
        <span className="event-emoji">{event.emoji}</span>

        <span className="event-category">
          {event.category}
        </span>

        <h1>{event.title}</h1>

        <p className="event-description">
          {event.description}
        </p>

        <div className="event-information">
          <p><strong>Date:</strong> {event.date}</p>
          <p><strong>Time:</strong> {event.time}</p>
          <p><strong>Venue:</strong> {event.venue}</p>
        </div>

        {message && (
          <p className="auth-message" role="status">
            {message}
          </p>
        )}

        <button
          className="event-button"
          type="button"
          onClick={handleRegister}
          disabled={registering}
        >
          {registering ? "Registering..." : "Register for Event"}
        </button>
      </div>

      {/* Event Photo Gallery */}
      <section className="event-extra-section">
        <h2>📸 Event Photo Gallery</h2>

        <p>Share photographs and memories from this event.</p>

        <form onSubmit={handlePhotoUpload} className="event-upload-form">
          <label>Choose photograph</label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <label>Photo caption</label>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            maxLength={250}
          />

          <button
            type="submit"
            className="event-button"
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? "Uploading..." : "Upload Event Photo"}
          </button>
        </form>

        {photoMessage && (
          <p className="auth-message" role="status">
            {photoMessage}
          </p>
        )}

        <div className="event-photo-grid">
          {photos.length === 0 ? (
            <p>No photographs shared for this event yet.</p>
          ) : (
            photos.map((photo) => (
              <div className="event-photo-card" key={photo._id}>
                <img src={photo.imageUrl} alt={photo.caption} />

                <div>
                  <h3>{photo.caption}</h3>
                  <p>
                    Uploaded by: {photo.uploader?.name || "Campus Student"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Event Reviews */}
      <section className="event-extra-section">
        <h2>⭐ Event Reviews & Ratings</h2>

        <div className="average-rating">
          <strong>{averageRating.toFixed(1)} / 5</strong>
          <span>Average rating ({reviews.length} reviews)</span>
        </div>

        <form onSubmit={handleReviewSubmit} className="event-review-form">
          <label>Your rating</label>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
            <option value={4}>⭐⭐⭐⭐ - Very Good</option>
            <option value={3}>⭐⭐⭐ - Good</option>
            <option value={2}>⭐⭐ - Average</option>
            <option value={1}>⭐ - Needs Improvement</option>
          </select>

          <label>Your review</label>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            minLength={5}
            maxLength={1000}
            required
          />

          <button
            type="submit"
            className="event-button"
            disabled={submittingReview}
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {reviewMessage && (
          <p className="auth-message" role="status">
            {reviewMessage}
          </p>
        )}

        <div className="event-reviews-list">
          {reviews.length === 0 ? (
            <p>No reviews yet. Be the first to share your experience!</p>
          ) : (
            reviews.map((review) => (
              <div className="event-review-card" key={review._id}>
                <h3>{review.student?.name || "Campus Student"}</h3>

                <p className="review-stars">
                  {"⭐".repeat(review.rating)}
                </p>

                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

export default EventDetails;
