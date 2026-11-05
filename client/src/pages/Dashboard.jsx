



import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch campus events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/events"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error("Unable to load events.");
        }

        setEvents(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="dashboard-page">

      <nav className="dashboard-navbar">
        <Link to="/" className="auth-brand">
          <span className="brand-icon">C</span>
          Campus<span>Connect</span>
        </Link>

        <div>
          <Link to="/gallery" className="event-button">
            Campus Gallery
          </Link>

          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">

        <span className="eyebrow">STUDENT DASHBOARD</span>

        <h1>
          Welcome, {user?.name || "Student"}!
        </h1>

        <p>Your campus journey starts here.</p>

        {/* Student Profile */}
        <div className="dashboard-card">
          <h2>Your Profile</h2>

          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Student ID:</strong> {user?.studentId}</p>
        </div>

        {/* Campus Gallery */}
        <section className="gallery-dashboard-section">
          <h2>Campus Gallery 📸</h2>
          <p>Share your favourite campus moments and explore photographs shared by students.</p>

          <Link to="/gallery" className="event-button">
            Explore Campus Gallery →
          </Link>
        </section>

        {/* Upcoming Events */}
        <section className="events-section">
          <div className="events-heading">
            <div>
              <span className="eyebrow">CAMPUS LIFE</span>
              <h2>Upcoming Events</h2>
              <p>Discover what's happening on your campus.</p>
            </div>
          </div>

          {loading && <p>Loading campus events...</p>}

          {error && <p className="auth-message error">{error}</p>}

          {!loading && !error && events.length === 0 && (
            <p>No events available right now.</p>
          )}

          <div className="events-grid">
            {events.map((event) => (
              <div className="event-card" key={event._id || event.id}>
                <div className="event-card-content">
                  <span className="event-tag">
                    CAMPUS EVENT
                  </span>

                  <h3>{event.title}</h3>

                  <p>{event.description}</p>

                  <div className="event-date">
                    {event.date}
                  </div>

                  <Link
                    to={`/event/${event.id}`}
                    className="event-button"
                  >
                    View Event →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}

export default Dashboard;
