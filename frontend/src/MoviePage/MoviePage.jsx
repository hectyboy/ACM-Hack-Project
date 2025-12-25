import React, { useState } from 'react'; // Imports MUST be at the top
import "./style.css";

// --- HELPER COMPONENT (Not exported) ---
const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
      <p className="rating-text">
        {rating > 0 ? `You rated this ${rating} stars!` : "Click to rate"}
      </p>
    </div>
  );
};

// --- MAIN CONTENT ---
export default function MoviePage({ movie }) {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">MovieHub</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              {/* ... other nav items ... */}
            </ul>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success" type="submit">Search Movies</button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <section className="main-content">
        <div className="movie-poster-components">
          <img className="movie-poster" src={movie.posterUrl} alt={movie.title} />
          
          <StarRating />

        {/*
          <p> Watch now:
            {movie.watchLinks.map((link) => (
              <a key={link.name} className="watch" href={link.url} target="_blank" rel="noreferrer">
                <img className="watch-logo" src={link.logo} alt={link.name} />
              </a>
            ))}
          </p>
          */}
        </div>

        <div className="movie-details">
          <h1>{movie.title}</h1>
          <h4>{movie.reviewInfo}</h4>
          <iframe 
            className="movie-trailer" 
            src={movie.trailerUrl} 
            title="YouTube video player" 
            style={{ border: "none" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>

          <p className="movie-description">
            {movie.description}
          </p>
        </div>
      </section>

      <section className="comments-section">
        <div>
          <p>Comments Section TBD</p>
        </div>
      </section>
    </>
  );
}