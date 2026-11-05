
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

  const handleRegister = async () => {
    setRegistering(true);
    setMessage("");

    try {
      const token = sessionStorage.getItem("token");

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
    </div>
  );
}

export default EventDetails;
