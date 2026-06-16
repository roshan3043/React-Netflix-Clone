# 🎬 React Netflix Clone (Fullstack)

A fully responsive, premium Netflix clone built with React, Vite, Node.js, Express, and Firebase, featuring live movie trailer search and streaming availability lookups.

🚀 **[Live Demo](https://react-netflix-clone-opal.vercel.app/)**

---

## ✨ Features

- **📱 Fully Responsive Design**: Seamless transitions across mobile, tablet, and desktop layouts. Includes an animated hamburger menu overlay for mobile devices.
- **🔍 Netflix-Style Movie Details**: Click any movie or TV show to open a detailed overlay showing genres, cast list, release year, IMDb ratings, and available streaming service links (Netflix, Prime Video, Disney+, etc.).
- **▶️ Direct Trailer Playback**: Custom backend scraper that searches YouTube and retrieves the exact official trailer video ID. Clicking "Play Trailer" directly loads the video in a new tab.
- **🔐 Firebase Authentication**: Fully styled login and sign-up pages with micro-animations and secure user registration/login.
- **⚡ Smart Caching & Rate-Limiting**: An in-memory cache system with a 24-hour TTL (Time-To-Live) and a 1-second delay throttle implemented on the backend to avoid hitting API rate limits and conserve RapidAPI quotas.

---

## 🛠️ Tech Stack

**Frontend:**
- React 19 & Vite
- Axios (for API requests)
- React Router (client-side routing)
- Pure CSS3 (featuring custom animations and variables)
- Firebase SDK (Authentication)

**Backend:**
- Node.js & Express
- Axios & dotenv
- Custom YouTube Search Scraper

**APIs & Services:**
- RapidAPI Streaming Availability API
- Firebase Auth

---

## 🚀 Local Setup & Installation

### Prerequisites
- Node.js (v16+ recommended)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/roshan3043/React-Netflix-Clone.git
cd React-Netflix-Clone
```

### 2. Configure the Backend
1. Navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   RAPIDAPI_KEY=your_rapidapi_key_here
   ```
4. Start the backend:
   ```bash
   npm start
   ```

### 3. Configure the Frontend
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory and insert your Firebase configuration keys:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
4. Run the frontend in development mode:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`.

---

## 🌐 Deployment

### Frontend (Vercel)
The client React app can be deployed to Vercel for free by setting the root directory to `client` and configuring your `VITE_` environment variables in Vercel settings.

### Backend (Render)
The server Express app can be deployed to Render for free by setting the root directory to `server`, build command to `npm install`, start command to `node index.js`, and declaring the `RAPIDAPI_KEY` under environment variables.
