import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import requests from '../requests';

function Banner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(requests.fetchNetflixOriginals);
        const results = request.data.results || [];
        const shuffled = results.sort(() => 0.5 - Math.random());
        setMovies(shuffled.slice(0, 5));
      } catch (err) {
        console.error('Banner fetch error:', err);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  function truncate(string, n) {
    return string?.length > n ? string.substr(0, n - 1) + '...' : string;
  }

  const movie = movies[currentIndex];

  if (!movie) return <header className="banner" />;

  return (
    <header className="banner">
      {/* Background layers for smooth crossfade */}
      {movies.map((m, idx) => (
        <div
          key={m.id}
          className="banner-bg"
          style={{
            backgroundImage: `url("${m.backdrop_path}")`,
            opacity: idx === currentIndex ? 1 : 0,
          }}
        />
      ))}

      {/* Content */}
      <div className="banner-contents" key={movie.id}>
        <h1 className="banner-title">
          {movie.title || movie.name}
        </h1>

        {/* Genre pills */}
        {movie.genres && movie.genres.length > 0 && (
          <div className="banner-genres">
            {movie.genres.map((genre, i) => (
              <span key={i} className="banner-genre-pill">
                {genre}
              </span>
            ))}
          </div>
        )}

        {/* Rating badge */}
        {movie.rating && (
          <div className="banner-rating">
            {Math.round(movie.rating * 10)}
          </div>
        )}

        <p className="banner-description">
          {truncate(movie.overview, 150)}
        </p>

        <div className="banner-buttons">
          <button
            className="banner-button play"
            onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
          >
            ▶ Play
          </button>
          <button
            className="banner-button"
            onClick={() => navigate(`/movie/${movie.id}`, { state: { movie } })}
          >
            ℹ More Info
          </button>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="banner-arrow left" onClick={goToPrevious}>
        &#10094;
      </div>
      <div className="banner-arrow right" onClick={goToNext}>
        &#10095;
      </div>

      {/* Dot indicators */}
      <div className="banner-dots">
        {movies.map((_, idx) => (
          <button
            key={idx}
            className={`banner-dot ${currentIndex === idx ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>

      <div className="banner-fadeBottom" />
    </header>
  );
}

export default Banner;
