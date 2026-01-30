import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Dashboard from './components/Dashboard/Dashboard';
import Welcome from './components/Welcome/Welcome';
import Auth from './components/Auth/Auth';
import TripSetup from './components/TripSetup/TripSetup';
import { db, auth } from './config/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [view, setView] = useState('welcome'); // 'welcome', 'auth', 'setup', 'dashboard'
  const [user, setUser] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userWidgetRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userWidgetRef.current && !userWidgetRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Function to handle fetching user data and setting view
  const processUserLogin = async (firebaseUser) => {
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL
    });

    try {
      // Fetch latest trip for this user
      const q = query(
        collection(db, "trips"),
        where("userId", "==", firebaseUser.uid)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Convert and Sort Client-Side to get the latest
        const trips = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Handle Firestore Timestamp vs Date string vs null
          let createdTime = 0;
          if (data.createdAt?.seconds) {
            createdTime = data.createdAt.seconds;
          } else if (typeof data.createdAt === 'string') {
            createdTime = new Date(data.createdAt).getTime();
          }
          return { id: doc.id, ...data, _sortTime: createdTime };
        });

        // Sort Descending (Newest First)
        trips.sort((a, b) => b._sortTime - a._sortTime);

        setCurrentTrip(trips[0]);

        // Restore last view if available, otherwise default to dashboard
        const lastView = localStorage.getItem('lastView');
        if (lastView === 'setup') {
          setView('setup');
        } else {
          setView('dashboard');
        }

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
    if (view === 'dashboard' || view === 'setup') {
      localStorage.setItem('lastView', view);
    }
  }, [view]);

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
      <div className="loading-screen">
        <h2 className="loading-text">Welcome to your journey</h2>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Floating User Widget (Only show when logged in and not on auth pages) */}
      {user && view !== 'welcome' && view !== 'auth' && (
        <div className="user-widget" ref={userWidgetRef}>
          <div className="user-badge" onClick={() => setShowUserMenu(!showUserMenu)}>
            <div className="user-avatar-small">
              {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
            </div>
            <span className="user-name">{user.displayName ? user.displayName.split(' ')[0] : 'User'}</span>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"></path></svg>
          </div>

          {showUserMenu && (
            <div className="user-menu">
              <button onClick={() => { setView('dashboard'); setShowUserMenu(false); }}>
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                Dashboard
              </button>
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
        <TripSetup
          user={user}
          onComplete={handleTripComplete}
          onCancel={currentTrip ? () => setView('dashboard') : null}
        />
      )}
      {view === 'dashboard' && (
        <Dashboard user={user} initialTripData={currentTrip} onNewPlan={handleNewPlan} />
      )}
    </div>
  );
}

export default App;
