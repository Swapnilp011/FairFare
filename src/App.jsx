import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Welcome from './components/Welcome/Welcome';
import Auth from './components/Auth/Auth';

function App() {
  const [view, setView] = useState('welcome'); // 'welcome', 'auth', or 'dashboard'
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    // Store only serializable data
    setUser({
      uid: userData.uid,
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL
    });
    setView('dashboard');
  };

  return (
    <div className="App">
      {view === 'welcome' && (
        <Welcome onStart={() => setView('auth')} />
      )}
      {view === 'auth' && (
        <Auth onLogin={handleLogin} />
      )}
      {view === 'dashboard' && (
        <Dashboard user={user} />
      )}
    </div>
  );
}

export default App;
