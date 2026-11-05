
import { useEffect, useState } from "react";
import "./CampusGallery.css";

function CampusGallery() {
  const [photos, setPhotos] = useState([]);
  const [events, setEvents] = useState([]);

  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [eventId, setEventId] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const token = sessionStorage.getItem("token");

  // Load campus photographs
  const fetchPhotos = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/photos");
      const result = await response.json();

      if (result.success) {
        setPhotos(result.data);
      }
    } catch (error) {
      setMessage("Unable to load campus photographs.");
    } finally {
      setLoading(false);
    }
  };

  // Load available events
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");
      const result = await response.json();

      if (result.success) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error("Unable to load events:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchEvents();
  }, []);

  // Upload a photograph
  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("Please login before uploading a photograph.");
      return;
    }

    if (!selectedFile) {
      setMessage("Please select a photograph.");
      return;
    }

    if (!caption.trim()) {
      setMessage("Please enter a caption.");
      return;
    }

    const formData = new FormData();

    formData.append("photo", selectedFile);
    formData.append("caption", caption.trim());

    if (eventId) {
      formData.append("eventId", eventId);
    }

    try {
      setUploading(true);

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

      setMessage("Photograph uploaded successfully!");
      setCaption("");
      setSelectedFile(null);
      setEventId("");

      e.target.reset();

      await fetchPhotos();
    } catch (error) {
      setMessage(error.message || "Unable to upload photograph.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>Campus Gallery</h1>
        <p>Capture and share your favourite campus moments.</p>
      </div>

      <div className="gallery-upload-card">
        <h2>Share a Campus Moment</h2>

        <form onSubmit={handleUpload}>
          <label>Choose a photograph</label>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />

          <label>Caption</label>

          <textarea
            placeholder="Write something about this photograph..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            maxLength={250}
          />

          <label>Associate with an event (optional)</label>

          <select
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Shared Campus Gallery</option>

            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>

          <button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Photograph"}
          </button>
        </form>

        {message && <p className="gallery-message">{message}</p>}
      </div>

      <div className="gallery-section">
        <h2>Campus Moments</h2>

        {loading ? (
          <p>Loading photographs...</p>
        ) : photos.length === 0 ? (
          <p className="empty-gallery">
            No photographs yet. Be the first to share a campus moment!
          </p>
        ) : (
          <div className="gallery-grid">
            {photos.map((photo) => (
              <div className="gallery-photo-card" key={photo._id}>
                <img
                  src={photo.imageUrl}
                  alt={photo.caption}
                />

                <div className="gallery-photo-info">
                  <h3>{photo.caption}</h3>

                  <p>
                    Uploaded by: {photo.uploader?.name || "Campus Student"}
                  </p>

                  <span>{photo.eventTitle}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CampusGallery;
