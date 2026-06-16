import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../axios';
import Navbar from '../components/Navbar';

const SERVICE_COLORS = {
  netflix: { bg: '#E50914', label: 'Netflix' },
  prime: { bg: '#00A8E1', label: 'Prime Video' },
  disney: { bg: '#113CCF', label: 'Disney+' },
  hbo: { bg: '#B535F6', label: 'HBO Max' },
  hulu: { bg: '#1CE783', label: 'Hulu' },
  apple: { bg: '#555', label: 'Apple TV+' },
  peacock: { bg: '#FDB927', label: 'Peacock' },
  paramount: { bg: '#0064FF', label: 'Paramount+' },
  mubi: { bg: '#001489', label: 'MUBI' },
  curiosity: { bg: '#27B4E1', label: 'Curiosity Stream' },
};

function MovieDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;
  const [trailerLoading, setTrailerLoading] = useState(false);

  if (!movie) {
    return (
      <div style={styles.emptyState}>
        <Navbar />
        <div style={styles.emptyContent}>
          <h2 style={{ fontSize: '2rem', marginBottom: '16px' }}>Movie not found</h2>
          <p style={{ color: '#999', marginBottom: '24px' }}>
            We couldn't load this title. Please go back and try again.
          </p>
          <button style={styles.backBtnEmpty} onClick={() => navigate('/')}>
            ← Back to Browse
          </button>
        </div>
      </div>
    );
  }

  const movieName = movie.title || movie.name || 'Untitled';
  const ratingPercent = movie.rating;

  const handlePlayTrailer = async () => {
    setTrailerLoading(true);
    try {
      const res = await axios.get(`/api/trailer?q=${encodeURIComponent(movieName)}`);
      const url = res.data?.url;
      if (url) {
        window.open(url, '_blank');
      }
    } catch (err) {
      // Fallback: open YouTube search directly
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(movieName + ' official trailer')}`,
        '_blank'
      );
    } finally {
      setTrailerLoading(false);
    }
  };

  const handleStreamingClick = (link) => {
    window.open(link, '_blank');
  };

  const streamingEntries = movie.streamingOptions
    ? Object.entries(movie.streamingOptions)
    : [];

  return (
    <div style={styles.page}>
      <Navbar />

      {/* ===== BACKDROP HERO ===== */}
      <div style={styles.heroWrapper}>
        <div
          style={{
            ...styles.heroImage,
            backgroundImage: movie.backdrop_path
              ? `url("${movie.backdrop_path}")`
              : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          }}
        />
        <div style={styles.heroGradientBottom} />
        <div style={styles.heroGradientLeft} />

        {/* Back Button */}
        <button
          style={styles.backBtn}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          ← Back to Browse
        </button>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={styles.contentWrapper}>
        <div style={styles.contentInner}>
          {/* Poster */}
          <div style={styles.posterContainer}>
            {movie.poster_path ? (
              <img
                src={movie.poster_path}
                alt={movieName}
                style={styles.poster}
              />
            ) : (
              <div style={styles.posterPlaceholder}>
                <span style={{ fontSize: '3rem' }}>🎬</span>
                <span style={{ fontSize: '0.9rem', marginTop: '8px' }}>No Poster</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div style={styles.infoContainer}>
            {/* Title */}
            <h1 style={styles.title}>{movieName}</h1>

            {/* Meta row: year, type badge, rating */}
            <div style={styles.metaRow}>
              {movie.year && (
                <span style={styles.year}>{movie.year}</span>
              )}
              {movie.showType && (
                <span
                  style={{
                    ...styles.typeBadge,
                    background:
                      movie.showType === 'series'
                        ? 'linear-gradient(135deg, #667eea, #764ba2)'
                        : 'linear-gradient(135deg, #e50914, #b20710)',
                  }}
                >
                  {movie.showType === 'series' ? 'Series' : 'Movie'}
                </span>
              )}
              {ratingPercent != null && (
                <span style={styles.ratingBadge}>
                  <span style={{ color: '#ffd700', marginRight: '4px' }}>★</span>
                  {ratingPercent}%
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div style={styles.genresRow}>
                {movie.genres.map((genre, i) => (
                  <span key={i} style={styles.genrePill}>
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            {movie.overview && (
              <p style={styles.overview}>{movie.overview}</p>
            )}

            {/* Cast */}
            {movie.cast && movie.cast.length > 0 && (
              <div style={styles.castSection}>
                <span style={styles.castLabel}>Cast: </span>
                <span style={styles.castList}>
                  {movie.cast.slice(0, 6).join(', ')}
                  {movie.cast.length > 6 && ' ...'}
                </span>
              </div>
            )}

            {/* ===== ACTION BUTTONS ===== */}
            <div style={styles.actionsRow}>
              {/* Play Trailer */}
              <button
                style={{
                  ...styles.playBtn,
                  opacity: trailerLoading ? 0.7 : 1,
                  cursor: trailerLoading ? 'wait' : 'pointer',
                }}
                onClick={handlePlayTrailer}
                disabled={trailerLoading}
                onMouseEnter={(e) => {
                  if (!trailerLoading) {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow =
                      '0 0 30px rgba(229,9,20,0.6), 0 8px 32px rgba(0,0,0,0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 20px rgba(229,9,20,0.4), 0 4px 16px rgba(0,0,0,0.3)';
                }}
              >
                {trailerLoading ? (
                  <>
                    <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite', fontSize: '1.2rem' }}>⟳</span>
                    Finding Trailer...
                  </>
                ) : (
                  <>
                    <span style={styles.playIcon}>▶</span>
                    Play Trailer
                  </>
                )}
              </button>
            </div>

            {/* ===== STREAMING OPTIONS ===== */}
            {streamingEntries.length > 0 && (
              <div style={styles.streamingSection}>
                <h3 style={styles.streamingTitle}>Available On:</h3>
                <div style={styles.streamingRow}>
                  {streamingEntries.map(([service, options]) => {
                    const info = SERVICE_COLORS[service] || {
                      bg: '#444',
                      label: service.charAt(0).toUpperCase() + service.slice(1),
                    };
                    const link =
                      Array.isArray(options) && options.length > 0
                        ? options[0].link
                        : '#';

                    return (
                      <button
                        key={service}
                        style={{
                          ...styles.streamingBtn,
                          background: info.bg,
                        }}
                        onClick={() => handleStreamingClick(link)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                          e.currentTarget.style.boxShadow = `0 6px 20px ${info.bg}66`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {info.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inline CSS for animations & responsive */}
      <style>{`
        @keyframes movieDetailFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes movieDetailSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes movieDetailPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(229,9,20,0.4), 0 4px 16px rgba(0,0,0,0.3); }
          50%      { box-shadow: 0 0 40px rgba(229,9,20,0.7), 0 8px 32px rgba(0,0,0,0.5); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .movie-detail-content-inner {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
          }
          .movie-detail-poster-container {
            margin-bottom: 24px !important;
            margin-right: 0 !important;
          }
          .movie-detail-info {
            align-items: center !important;
          }
          .movie-detail-meta-row,
          .movie-detail-genres-row,
          .movie-detail-actions-row,
          .movie-detail-streaming-row {
            justify-content: center !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ===== STYLES ===== */
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#141414',
    color: '#fff',
    position: 'relative',
  },
  emptyState: {
    minHeight: '100vh',
    backgroundColor: '#141414',
    color: '#fff',
  },
  emptyContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 70px)',
    textAlign: 'center',
    padding: '0 20px',
  },
  backBtnEmpty: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  },

  /* Hero */
  heroWrapper: {
    position: 'relative',
    width: '100%',
    height: '60vh',
    minHeight: '400px',
    overflow: 'hidden',
  },
  heroImage: {
    position: 'absolute',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    animation: 'movieDetailFadeIn 0.8s ease',
  },
  heroGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    background:
      'linear-gradient(to top, #141414 0%, rgba(20,20,20,0.9) 30%, rgba(20,20,20,0.4) 60%, transparent 100%)',
  },
  heroGradientLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '40%',
    background:
      'linear-gradient(to right, rgba(20,20,20,0.8) 0%, transparent 100%)',
  },
  backBtn: {
    position: 'absolute',
    top: '80px',
    left: '24px',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    zIndex: 10,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    letterSpacing: '0.3px',
  },

  /* Content */
  contentWrapper: {
    position: 'relative',
    marginTop: '-120px',
    padding: '0 48px 60px',
    zIndex: 5,
    animation: 'movieDetailFadeIn 0.6s ease',
  },
  contentInner: {
    display: 'flex',
    alignItems: 'flex-start',
    maxWidth: '1200px',
    margin: '0 auto',
    gap: '40px',
  },

  /* Poster */
  posterContainer: {
    flexShrink: 0,
    animation: 'movieDetailSlideUp 0.5s ease',
  },
  poster: {
    width: '220px',
    borderRadius: '12px',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.4)',
    display: 'block',
  },
  posterPlaceholder: {
    width: '220px',
    height: '330px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
  },

  /* Info */
  infoContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    animation: 'movieDetailFadeIn 0.6s ease 0.2s both',
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
    fontWeight: 800,
    margin: '0 0 12px 0',
    lineHeight: 1.15,
    letterSpacing: '-0.5px',
    textShadow: '0 2px 20px rgba(0,0,0,0.5)',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  year: {
    fontSize: '1.1rem',
    color: '#aaa',
    fontWeight: 500,
  },
  typeBadge: {
    padding: '4px 14px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 700,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  ratingBadge: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,215,0,0.3)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 600,
  },

  /* Genres */
  genresRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '20px',
  },
  genrePill: {
    padding: '5px 14px',
    borderRadius: '20px',
    fontSize: '0.82rem',
    fontWeight: 500,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#ddd',
    letterSpacing: '0.3px',
  },

  /* Overview */
  overview: {
    fontSize: '1.05rem',
    lineHeight: 1.7,
    color: '#ccc',
    maxWidth: '650px',
    marginBottom: '20px',
  },

  /* Cast */
  castSection: {
    marginBottom: '24px',
  },
  castLabel: {
    color: '#888',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  castList: {
    color: '#ccc',
    fontSize: '0.95rem',
  },

  /* Actions */
  actionsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '28px',
  },
  playBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'linear-gradient(135deg, #e50914 0%, #b20710 100%)',
    color: '#fff',
    border: 'none',
    padding: '14px 36px',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: '0.5px',
    boxShadow: '0 4px 20px rgba(229,9,20,0.4), 0 4px 16px rgba(0,0,0,0.3)',
    transition: 'all 0.3s ease',
    animation: 'movieDetailPulse 2.5s ease-in-out infinite',
  },
  playIcon: {
    fontSize: '1.2rem',
  },

  /* Streaming */
  streamingSection: {
    marginTop: '4px',
  },
  streamingTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#999',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  streamingRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  streamingBtn: {
    color: '#fff',
    border: 'none',
    padding: '10px 22px',
    borderRadius: '30px',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
    letterSpacing: '0.3px',
    transition: 'all 0.3s ease',
  },
};

export default MovieDetail;
