import React from 'react';
import CurrencyConverter from './CurrencyConverter';
import PackingList from './PackingList';

const Tools = ({ city }) => {
    return (
        <div className="tools-view">
            <header className="top-header">
                <div>
                    <h1>Travel Tools</h1>
                    <p className="date-text">Utilities to make your trip smoother.</p>
                </div>
            </header>
            <div className="tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <CurrencyConverter />
                <PackingList defaultLocation={city} />

                {/* Placeholder for future tools */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', border: '2px dashed #e5e7eb', opacity: 0.6 }}>
                    <div style={{ color: '#d1d5db', marginBottom: '1rem' }}>
                        <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    </div>
                    <h3 style={{ color: '#9ca3af', fontSize: '0.9rem' }}>More tools coming soon</h3>
                </div>
            </div>
        </div>
    );
};

export default Tools;
