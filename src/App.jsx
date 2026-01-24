import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Welcome from './components/Welcome/Welcome';
import Auth from './components/Auth/Auth';
import TripSetup from './components/TripSetup/TripSetup';
import { db, auth } from './config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [view, setView] = useState('welcome'); // 'welcome', 'auth', 'setup', 'dashboard'
  const [user, setUser] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Function to handle fetching user data and setting view
  const processUserLogin = async (firebaseUser) => {
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    });

    try {
      const tripDoc = await getDoc(doc(db, "trips", firebaseUser.uid));
      if (tripDoc.exists()) {
        setCurrentTrip(tripDoc.data());
        setView('dashboard');
      } else {
        // Fallback: Check LocalStorage
        const localTrip = localStorage.getItem('currentTrip');
        if (localTrip) {
          console.log("Found trip in local storage (DB missing)");
          setCurrentTrip(JSON.parse(localTrip));
          setView('dashboard');
        } else {
          setView('setup');
        }
      }
    } catch (err) {
      console.error("Error checking trip:", err);
      // Fallback: Check LocalStorage
      const localTrip = localStorage.getItem('currentTrip');
      if (localTrip) {
        console.log("Found trip in local storage (DB Error)");
        setCurrentTrip(JSON.parse(localTrip));
        setView('dashboard');
      } else {
        setView('setup');
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        processUserLogin(currentUser);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    processUserLogin(userData);
  };

  const handleTripComplete = (tripData) => {
    setCurrentTrip(tripData);
    setView('dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear local state
      setUser(null);
      setCurrentTrip(null);
      setView('welcome');
      setShowUserMenu(false);
      localStorage.removeItem('currentTrip'); // Optional: clear cached trip
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleNewPlan = () => {
    setView('setup');
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: 'white' }}>
        <h2>Loading your journey...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Floating User Widget (Only show when logged in and not on auth pages) */}
      {user && view !== 'welcome' && view !== 'auth' && (
        <div className="user-widget">
          <div className="user-badge" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar-small">
              {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
            <span className="user-name">{user.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
          </div>

          {showUserMenu && (
            <div className="user-menu">
              <button onClick={handleLogout}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Logout
              </button>
            </div>
          )}
        </div>
      )}

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
        <Dashboard user={user} initialTripData={currentTrip} onNewPlan={handleNewPlan} />
      )}
    </div>
  );
}

export default App;
