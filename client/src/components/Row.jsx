import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

function Row({ title, fetchUrl, isLargeRow = false }) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const rowRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results || []);
      } catch (err) {
        console.error('Row fetch error:', err);
      }
      setIsLoading(false);
    }
    fetchData();
  }, [fetchUrl]);

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -800, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 800, behavior: 'smooth' });
    }
  };

  const handleClick = (movie) => {
    navigate(`/movie/${movie.id}`, {
      state: { movie },
    });
  };

  return (
    <div className="row">
      <h2>{title}</h2>

      <div className="row-posters-wrapper">
        {/* Left Arrow */}
        <button className="row-arrow left" onClick={scrollLeft}>
          &#10094;
        </button>

        <div className="row-posters" ref={rowRef}>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="skeleton"
                  style={{
                    width: isLargeRow ? '200px' : '250px',
                    height: isLargeRow ? '300px' : '140px',
                  }}
                />
              ))
            : movies.map((movie, index) => {
                const imgSrc = isLargeRow ? movie.poster_path : movie.backdrop_path;
                if (!imgSrc) return null;

                return (
                  <div
                    key={movie.id}
                    className={`row-poster-container ${isLargeRow ? 'large' : ''}`}
                    onClick={() => handleClick(movie)}
                    style={{
                      animation: `fadeIn 0.4s ease ${index * 0.05}s both`,
                    }}
                  >
                    <img
                      className={`row-poster ${isLargeRow ? 'row-posterLarge' : ''}`}
                      src={imgSrc}
                      alt={movie.title || movie.name}
                    />
                    <div className="row-poster-overlay">
                      <span className="poster-title">
                        {movie.title || movie.name}
                      </span>
                      <span className="poster-meta">
                        {movie.year && <span>{movie.year}</span>}
                        {movie.rating && (
                          <span className="poster-rating">
                            ★ {movie.rating}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Right Arrow */}
        <button className="row-arrow right" onClick={scrollRight}>
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default Row;
