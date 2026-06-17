import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import Row from '../components/Row';
import requests from '../requests';

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const targetId = location.state.scrollTo;
      // Wait slightly for DOM rendering
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);
      
      // Clear location state history so it doesn't scroll again on manual page refresh
      window.history.replaceState({}, document.title);
      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="homeScreen">
      <Navbar />
      <div id="banner">
        <Banner />
      </div>
      <div id="netflix-originals">
        <Row title="NETFLIX ORIGINALS" fetchUrl={requests.fetchNetflixOriginals} isLargeRow />
      </div>
      <div id="trending">
        <Row title="Trending Now" fetchUrl={requests.fetchTrending} />
      </div>
      <div id="top-rated">
        <Row title="Top Rated" fetchUrl={requests.fetchTopRated} />
      </div>
      <div id="action-movies">
        <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} />
      </div>
      <div id="comedy-movies">
        <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
      </div>
      <div id="horror-movies">
        <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
      </div>
    </div>
  );
}

export default Home;
