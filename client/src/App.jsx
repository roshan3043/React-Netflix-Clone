import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import Home from './pages/Home';
import LoginScreen from './pages/LoginScreen';
import PlansScreen from './pages/PlansScreen';
import Checkout from './pages/Checkout';
import MovieDetail from './pages/MovieDetail';
import SearchScreen from './pages/SearchScreen';
import ProfileScreen from './pages/ProfileScreen';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(() => {
    return localStorage.getItem('netflix_subscribed') === 'true';
  });

  const handleSubscribe = (planId = 'standard') => {
    localStorage.setItem('netflix_subscribed', 'true');
    localStorage.setItem('netflix_plan', planId);
    setIsSubscribed(true);
  };

  const handleCancelSubscription = () => {
    localStorage.removeItem('netflix_subscribed');
    localStorage.removeItem('netflix_plan');
    setIsSubscribed(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
      } else {
        setUser(null);
        localStorage.removeItem('netflix_subscribed');
        localStorage.removeItem('netflix_plan');
        setIsSubscribed(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#141414', color: 'white' }}>
        <div style={{ animation: 'pulse 1.5s infinite' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/login" element={!user ? <LoginScreen /> : <Navigate to="/" />} />
          <Route path="/plans" element={user && !isSubscribed ? <PlansScreen onSubscribe={handleSubscribe} /> : <Navigate to="/" />} />
          <Route path="/checkout" element={user && !isSubscribed ? <Checkout onSubscribe={handleSubscribe} /> : <Navigate to="/" />} />
          <Route path="/" element={!user ? <Navigate to="/login" /> : !isSubscribed ? <Navigate to="/plans" /> : <Home />} />
          <Route path="/movie/:id" element={!user ? <Navigate to="/login" /> : !isSubscribed ? <Navigate to="/plans" /> : <MovieDetail />} />
          <Route path="/search" element={!user ? <Navigate to="/login" /> : !isSubscribed ? <Navigate to="/plans" /> : <SearchScreen />} />
          <Route path="/profile" element={!user ? <Navigate to="/login" /> : <ProfileScreen user={user} isSubscribed={isSubscribed} onSubscribe={handleSubscribe} onCancel={handleCancelSubscription} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
