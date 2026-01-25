import React from 'react';
import './Navbar.css';

const Navbar = ({ activeView, setActiveView, allTrips, currentTripId, onSwitchTrip, onNewPlan }) => {
    return (
        <nav className="navbar-container">
            {/* Logo Area (Desktop Only) */}
            <div className="nav-logo">
                <h2>FairFare</h2>
            </div>

            {/* Main Navigation Links */}
            <div className="nav-links-group">
                <div
                    className={`nav-item ${activeView === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveView('overview')}
                >
                    <div className="nav-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <span>Home</span>
                </div>

                <div className="nav-item">
                    <div className="nav-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    </div>
                    <span>Wallet</span>
                </div>

                <div
                    className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveView('analytics')}
                >
                    <div className="nav-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <span>Analytics</span>
                </div>

                <div className="nav-item new-plan-mobile" onClick={onNewPlan}>
                    <div className="nav-icon">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    </div>
                    <span>Plan</span>
                </div>
            </div>

            {/* My Trips List (Desktop Only) */}
            {allTrips && allTrips.length > 0 && (
                <div className="desktop-trips-list">
                    <h4>My Trips</h4>
                    <div className="trips-scroll">
                        {allTrips.map(trip => (
                            <div
                                key={trip.id}
                                onClick={() => onSwitchTrip(trip)}
                                className={`nav-trip-item ${currentTripId === trip.id ? 'active' : ''}`}
                            >
                                <span className="trip-icon">✈️</span>
                                <span className="trip-name">
                                    {trip.location}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Plan Button (Desktop Only) */}
            <div className="nav-item new-plan-btn desktop-only" onClick={onNewPlan}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                <span>New Plan</span>
            </div>
        </nav>
    );
};

export default Navbar;
