const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args)).catch(() => globalThis.fetch(...args));

async function testYouTubeScrape(query) {
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  console.log('Fetching:', searchUrl);
  
  const response = await fetch(searchUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  });
  
  const html = await response.text();
  console.log('HTML length:', html.length);
  
  // Extract first videoId from YouTube's initial data
  const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null && matches.length < 5) {
    if (!matches.includes(match[1])) {
      matches.push(match[1]);
    }
  }
  
  console.log('Found video IDs:', matches);
  if (matches.length > 0) {
    console.log('Direct URL:', `https://www.youtube.com/watch?v=${matches[0]}`);
  }
}

testYouTubeScrape('Wicked official trailer').catch(console.error);
