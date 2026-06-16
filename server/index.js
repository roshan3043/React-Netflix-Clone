const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const BASE_URL = 'https://streaming-availability.p.rapidapi.com';

// ─── In-Memory Cache (24-hour TTL) ─────────────────────────────────────────
const cache = {};
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in ms

function getCached(key) {
  const entry = cache[key];
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    console.log(`[CACHE HIT] ${key}`);
    return entry.data;
  }
  if (entry) {
    delete cache[key];
  }
  return null;
}

function setCache(key, data) {
  cache[key] = { data, timestamp: Date.now() };
  console.log(`[CACHE SET] ${key}`);
}

// ─── Rate Limiting: 1-second delay between API calls ───────────────────────
let lastApiCallTime = 0;

async function rateLimitedDelay() {
  const now = Date.now();
  const elapsed = now - lastApiCallTime;
  if (elapsed < 1000) {
    const waitMs = 1000 - elapsed;
    console.log(`[RATE LIMIT] Waiting ${waitMs}ms before next API call`);
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
  lastApiCallTime = Date.now();
}

// ─── API Helper ─────────────────────────────────────────────────────────────
async function fetchFromAPI(endpoint, params = {}) {
  const cacheKey = endpoint + '?' + new URLSearchParams(params).toString();

  const cached = getCached(cacheKey);
  if (cached) return cached;

  await rateLimitedDelay();

  console.log(`[API CALL] GET ${BASE_URL}${endpoint}`, params);
  const response = await axios.get(`${BASE_URL}${endpoint}`, {
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'streaming-availability.p.rapidapi.com',
    },
    params,
  });

  setCache(cacheKey, response.data);
  return response.data;
}

// ─── Format a single show ───────────────────────────────────────────────────
function formatShow(show) {
  return {
    id: show.id,
    imdbId: show.imdbId,
    tmdbId: show.tmdbId,
    title: show.title,
    name: show.title,
    overview: show.overview,
    backdrop_path:
      show.imageSet?.horizontalPoster?.w720 ||
      show.imageSet?.horizontalBackdrop?.w720 ||
      null,
    poster_path:
      show.imageSet?.verticalPoster?.w480 ||
      show.imageSet?.verticalPoster?.w360 ||
      null,
    genres: show.genres?.map((g) => g.name) || [],
    cast: show.cast || [],
    rating: show.rating,
    year: show.firstAirYear || show.releaseYear,
    showType: show.showType,
    streamingOptions: show.streamingOptions?.in || {},
  };
}

// ─── Format + filter (must have both backdrop and poster) ───────────────────
function formatAndFilter(shows) {
  return shows
    .map(formatShow)
    .filter((s) => s.backdrop_path && s.poster_path);
}

// ─── Routes ─────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK' });
});

// Trending movies (popular movies in India)
app.get('/api/movies/trending', async (_req, res) => {
  try {
    const data = await fetchFromAPI('/shows/search/filters', {
      country: 'in',
      show_type: 'movie',
      order_by: 'popularity_1year',
      order_direction: 'desc',
      output_language: 'en',
    });
    const results = formatAndFilter(data.shows || []);
    res.json({ results });
  } catch (err) {
    console.error('[ERROR] /api/movies/trending', err.message);
    res.status(500).json({ error: 'Failed to fetch trending movies' });
  }
});

// Netflix originals (Netflix catalog in India)
app.get('/api/movies/netflix-originals', async (_req, res) => {
  try {
    const data = await fetchFromAPI('/shows/search/filters', {
      country: 'in',
      catalogs: 'netflix',
      order_by: 'popularity_1year',
      order_direction: 'desc',
      output_language: 'en',
    });
    const results = formatAndFilter(data.shows || []);
    res.json({ results });
  } catch (err) {
    console.error('[ERROR] /api/movies/netflix-originals', err.message);
    res.status(500).json({ error: 'Failed to fetch Netflix originals' });
  }
});

// Top rated (popular series in India)
app.get('/api/movies/top-rated', async (_req, res) => {
  try {
    const data = await fetchFromAPI('/shows/search/filters', {
      country: 'in',
      show_type: 'series',
      order_by: 'popularity_1year',
      order_direction: 'desc',
      output_language: 'en',
    });
    const results = formatAndFilter(data.shows || []);
    res.json({ results });
  } catch (err) {
    console.error('[ERROR] /api/movies/top-rated', err.message);
    res.status(500).json({ error: 'Failed to fetch top rated series' });
  }
});

// Action movies
app.get('/api/movies/action', async (_req, res) => {
  try {
    const data = await fetchFromAPI('/shows/search/filters', {
      country: 'in',
      show_type: 'movie',
      genres: 'action',
      order_by: 'popularity_1year',
      order_direction: 'desc',
      output_language: 'en',
    });
    const results = formatAndFilter(data.shows || []);
    res.json({ results });
  } catch (err) {
    console.error('[ERROR] /api/movies/action', err.message);
    res.status(500).json({ error: 'Failed to fetch action movies' });
  }
});

// Comedy movies
app.get('/api/movies/comedy', async (_req, res) => {
  try {
    const data = await fetchFromAPI('/shows/search/filters', {
      country: 'in',
      show_type: 'movie',
      genres: 'comedy',
      order_by: 'popularity_1year',
      order_direction: 'desc',
      output_language: 'en',
    });
    const results = formatAndFilter(data.shows || []);
    res.json({ results });
  } catch (err) {
    console.error('[ERROR] /api/movies/comedy', err.message);
    res.status(500).json({ error: 'Failed to fetch comedy movies' });
  }
});

// Horror movies
app.get('/api/movies/horror', async (_req, res) => {
  try {
    const data = await fetchFromAPI('/shows/search/filters', {
      country: 'in',
      show_type: 'movie',
      genres: 'horror',
      order_by: 'popularity_1year',
      order_direction: 'desc',
      output_language: 'en',
    });
    const results = formatAndFilter(data.shows || []);
    res.json({ results });
  } catch (err) {
    console.error('[ERROR] /api/movies/horror', err.message);
    res.status(500).json({ error: 'Failed to fetch horror movies' });
  }
});

// Search by title
app.get('/api/movies/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ error: 'Missing search query parameter "q"' });
    }
    const data = await fetchFromAPI('/shows/search/title', {
      country: 'in',
      title: query,
      output_language: 'en',
    });
    // search/title returns an array directly
    const shows = Array.isArray(data) ? data : data.shows || [];
    const results = formatAndFilter(shows);
    res.json({ results });
  } catch (err) {
    console.error('[ERROR] /api/movies/search', err.message);
    res.status(500).json({ error: 'Failed to search movies' });
  }
});

// ─── YouTube Trailer Lookup (direct scrape — no API key needed) ─────────────
app.get('/api/trailer', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Missing query parameter q' });
  }

  const searchQuery = query + ' official trailer';
  const fallbackUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  // Check cache first
  const cacheKey = `trailer:${query}`;
  const cached = getCached(cacheKey);
  if (cached) {
    return res.json(cached);
  }

  try {
    // Fetch YouTube search results page
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      timeout: 8000,
    });

    // Extract first videoId from YouTube's server-rendered data
    const html = response.data;
    const match = html.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);

    if (match && match[1]) {
      const videoId = match[1];
      const result = {
        videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: query,
      };
      setCache(cacheKey, result);
      console.log(`[TRAILER] Found: ${query} → ${videoId}`);
      return res.json(result);
    }
  } catch (err) {
    console.log(`[TRAILER] Scrape failed for "${query}":`, err.message);
  }

  // Fallback to search URL
  const fallback = { videoId: null, url: fallbackUrl, title: query };
  res.json(fallback);
});

// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`RapidAPI Key configured: ${RAPIDAPI_KEY ? 'YES' : 'NO'}`);
});
