import { useEffect, useState } from "react";
import "../App.css";

const categories = [
  "All Events",
  "Hackathon",
  "Workshop",
  "Coding",
  "Cultural",
];

function App() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events");

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const result = await response.json();

      setEvents(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);
if (loading) {
  return <h2>Loading events...</h2>;
}

if (error) {
  return <h2>{error}</h2>;
}


  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      activeCategory === "All Events" ||
      event.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  function handleRegister(eventId) {
    setRegisteredEvents((previous) =>
      previous.includes(eventId)
        ? previous
        : [...previous, eventId]
    );
  }

  function formatDate(dateString) {
    return new Date(dateString + "T12:00:00").toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <a className="brand" href="#home">
          <span className="brand-icon">C</span>
          <span>Campus<span className="brand-accent">Connect</span></span>
        </a>

       <nav className="nav-links">
  <a className="nav-active" href="#events">Explore Events</a>
  <a href="#about">About</a>
  <a href="/login">Login</a>
<a href="/register" className="nav-cta">Register</a>
</nav>

        <a className="nav-cta" href="#events">Find an Event ↗</a>
      </header>

      <main id="home">
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              ✦ YOUR CAMPUS, YOUR COMMUNITY
            </span>

            <h1>
              Make your campus
              <br />
              life <span className="highlight">count.</span>
            </h1>

            <p className="hero-description">
              Discover events, meet your people, learn something new,
              and make every college moment memorable.
            </p>

            <a className="hero-button" href="#events">
              Explore upcoming events <span>→</span>
            </a>

            <div className="hero-note">
              <span className="online-dot"></span>
              Your next opportunity is waiting.
            </div>
          </div>

          <div className="hero-art" aria-label="Student community illustration">
            <div className="art-circle circle-one"></div>
            <div className="art-circle circle-two"></div>
            <div className="art-card art-card-top">
              <span>✨</span>
              <div>
                <strong>Find your people</strong>
                <small>Ideas start here</small>
              </div>
            </div>
            <div className="art-main">
              <span className="art-emoji">🎓</span>
              <span className="art-sparkle">✦</span>
              <h3>More than a campus.</h3>
              <p>A community of possibilities.</p>
            </div>
            <div className="art-card art-card-bottom">
              <span>🚀</span>
              <div>
                <strong>Try something new</strong>
                <small>Learn · Build · Connect</small>
              </div>
            </div>
          </div>
        </section>

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <span className="eyebrow">WHAT'S HAPPENING</span>
              <h2>Find your next <span>thing.</span></h2>
              <p>Good people. Great ideas. Unforgettable events.</p>
            </div>
            <div className="event-count">
              <strong>{filteredEvents.length}</strong>
              <span>events found</span>
            </div>
          </div>

          <div className="search-bar">
            <span className="search-icon">⌕</span>
            <input
              type="search"
              placeholder="Search events or topics..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search events"
            />
            {search && (
              <button
                className="clear-search"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          <div className="category-list" aria-label="Filter events by category">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  activeCategory === category
                    ? "category-button category-active"
                    : "category-button"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="event-grid">
            {filteredEvents.map((event) => {
              const isRegistered = registeredEvents.includes(event.id);

              return (
                <article className="event-card" key={event.id}>
                  <div className={`event-art ${event.color}`}>
                    <span className="event-category">{event.category}</span>
                    <span className="event-emoji">{event.emoji}</span>
                    <span className="art-decoration">✳</span>
                  </div>

                  <div className="event-body">
                    <div className="event-date">
                      <span>◷</span> {formatDate(event.date)}
                      <span className="date-divider">·</span>
                      {event.time}
                    </div>

                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>

                    <div className="event-venue">
                      <span>⌖</span> {event.venue}
                    </div>

                    <button
                      className={
                        isRegistered
                          ? "register-button registered"
                          : "register-button"
                      }
                      onClick={() => handleRegister(event.id)}
                      disabled={isRegistered}
                    >
                      {isRegistered ? "✓ Added to my events" : "Register interest ↗"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {filteredEvents.length === 0 && (
            <div className="empty-state">
              <span>🔎</span>
              <h3>No events found</h3>
              <p>Try a different search or choose another category.</p>
              <button
                className="reset-button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All Events");
                }}
              >
                Show all events
              </button>
            </div>
          )}
        </section>

        <section className="community-banner" id="about">
          <div>
            <span className="eyebrow">YOUR CAMPUS JOURNEY STARTS HERE</span>
            <h2>Show up curious. Leave inspired.</h2>
            <p>There's always something new to discover on campus.</p>
          </div>
          <a href="#events" className="banner-button">Discover events →</a>
        </section>
      </main>

      <footer className="footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-icon">C</span>
          <span>Campus<span className="brand-accent">Connect</span></span>
        </a>
        <p>Built for campus life, by the campus community.</p>
        <span>Campus Connect © 2026</span>
      </footer>
    </div>
  );
}

export default App;


