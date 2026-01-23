import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Welcome from './components/Welcome/Welcome';
import Auth from './components/Auth/Auth';
import TripSetup from './components/TripSetup/TripSetup';
import { db } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [view, setView] = useState('welcome'); // 'welcome', 'auth', 'setup', 'dashboard'
  const [user, setUser] = useState(null);

  const handleLogin = async (userData) => {
    // Check if user has an active trip
    try {
      const tripDoc = await getDoc(doc(db, "trips", userData.uid));
      if (tripDoc.exists()) {
        setView('dashboard');
      } else {
        setView('setup');
      }
    } catch (err) {
      console.error("Error checking trip:", err);
      setView('setup'); // Fallback
    }

    setUser({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL
    });
  };

  const handleTripComplete = (tripData) => {
    // If tripData is passed (from setup), we can use it to store locally or pass to Dashboard
    // For now, let's just switch view. 
    // Ideally, we lift this state up or put it in a context if DB fails.
    // Let's pass it as a prop to Dashboard in the next render.
    setCurrentTrip(tripData);
    setView('dashboard');
  };

  const [currentTrip, setCurrentTrip] = useState(null);

  return (
    <div className="App">
      {view === 'welcome' && (
        <Welcome onStart={() => setView('auth')} />
      )}
      {view === 'auth' && (
        <Auth onLogin={handleLogin} />
      )}
      {view === 'setup' && (
        <TripSetup user={user} onComplete={handleTripComplete} />
      )}
      {view === 'dashboard' && (
        <Dashboard user={user} initialTripData={currentTrip} />
      )}
    </div>
  );
}

export default App;
