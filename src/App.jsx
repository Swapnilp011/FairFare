import React, { useState } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Welcome from './components/Welcome/Welcome';

function App() {
  const [view, setView] = useState('welcome'); // 'welcome' or 'dashboard'

  return (
    <div className="App">
      {view === 'welcome' && (
        <Welcome onStart={() => setView('dashboard')} />
      )}
      {view === 'dashboard' && (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
