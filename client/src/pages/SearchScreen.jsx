import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from '../axios';
import requests from '../requests';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchScreen() {
  const query = useQuery().get('q');
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSearch() {
      if (!query) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const request = await axios.get(`${requests.fetchSearch}${query}`);
        setMovies(request.data.results || []);
      } catch (err) {
        console.error('Search error:', err);
      }
      setIsLoading(false);
    }
    fetchSearch();
  }, [query]);

  const handleClick = (movie) => {
    navigate(`/movie/${movie.id}`, {
      state: { movie },
    });
  };

  return (
    <div className="search-screen">
      <Navbar />
      <h2 style={{ marginBottom: '24px', fontWeight: 600, fontSize: '1.4rem' }}>
        Search Results for: &ldquo;{query}&rdquo;
      </h2>

      {/* Loading State */}
      {isLoading && (
        <div className="search-skeleton-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="search-skeleton-card" />
          ))}
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && movies.length > 0 && (
        <div className="search-grid">
          {movies.map((movie, index) =>
            movie.poster_path ? (
              <div
                key={movie.id}
                className="search-card"
                onClick={() => handleClick(movie)}
                style={{
                  animation: `slideUp 0.4s ease ${index * 0.04}s both`,
                }}
              >
                <img
                  src={movie.poster_path}
                  alt={movie.title || movie.name}
                />
                <div className="search-card-overlay">
                  <span className="card-title">
                    {movie.title || movie.name}
                  </span>
                  <span className="card-meta">
                    {movie.year && <span>{movie.year}</span>}
                    {movie.rating && (
                      <span className="card-rating">★ {movie.rating}</span>
                    )}
                  </span>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* No Results */}
      {!isLoading && movies.length === 0 && (
        <div className="search-no-results">
          <h3>No results found</h3>
          <p>Try searching for a different title, person, or genre.</p>
        </div>
      )}
    </div>
  );
}

export default SearchScreen;
