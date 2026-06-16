import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Player() {
  const navigate = useNavigate();
  const location = useLocation();

  const movieName = location.state?.movieName || 'Video';
  const streamingOptions = location.state?.streamingOptions || {};

  const activePlan = localStorage.getItem('netflix_plan');
  const isFreePlan = activePlan === 'free';

  // Ad State
  const [isAdPlaying, setIsAdPlaying] = useState(isFreePlan);
  const [adTimeLeft, setAdTimeLeft] = useState(5);

  // YouTube embed URL
  const videoUrl = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(movieName + ' official trailer')}`;

  // Streaming options entries
  const streamingEntries = Object.entries(streamingOptions);
  const hasStreaming = streamingEntries.length > 0;

  // Handle Ad countdown
  useEffect(() => {
    let timer;
    if (isAdPlaying && adTimeLeft > 0) {
      timer = setInterval(() => {
        setAdTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isAdPlaying && adTimeLeft === 0) {
      setIsAdPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isAdPlaying, adTimeLeft]);

  return (
    <div className="player-container">
      {/* Back Button */}
      <button className="player-back" onClick={() => navigate('/')}>
        ← Back
      </button>

      {/* Video Player */}
      {!isAdPlaying && (
        <iframe
          src={videoUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          allowFullScreen
          allow="autoplay; fullscreen; encrypted-media"
          title={movieName}
        />
      )}

      {/* Movie Title Overlay */}
      {!isAdPlaying && (
        <div className="player-title-overlay">
          {movieName}
        </div>
      )}

      {/* Streaming Options */}
      {!isAdPlaying && hasStreaming && (
        <div className="player-streaming">
          <span className="player-streaming-label">Watch On</span>
          <div className="player-streaming-badges">
            {streamingEntries.map(([service, options]) => {
              const link = Array.isArray(options) && options[0]?.link;
              return (
                <a
                  key={service}
                  className="player-streaming-badge"
                  href={link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {service}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Ad Overlay for Free Plan */}
      {isAdPlaying && (
        <div className="player-ad-overlay">
          <h2>Advertisement</h2>
          <p>Your video will begin in {adTimeLeft} seconds...</p>
          <button
            className="btn-primary"
            style={{
              marginTop: '24px',
              opacity: adTimeLeft > 2 ? 0.4 : 1,
              cursor: adTimeLeft > 2 ? 'not-allowed' : 'pointer',
            }}
            disabled={adTimeLeft > 2}
            onClick={() => setIsAdPlaying(false)}
          >
            Skip Ad
          </button>
        </div>
      )}
    </div>
  );
}

export default Player;
