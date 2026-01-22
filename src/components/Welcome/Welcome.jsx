import React from 'react';
import './Welcome.css';

const Welcome = ({ onStart }) => {
    return (
        <div className="welcome-container">
            <div className="welcome-content">
                <h1 className="welcome-title">FairFare</h1>
                <p className="welcome-subtitle">Smart Budget Travel Assistant</p>
                <p className="welcome-description">
                    Plan your trips, track expenses, and ensure you never overpay with our AI-powered price guard.
                </p>
                <button className="start-btn" onClick={onStart}>
                    Get Started
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="arrow-icon"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </button>
            </div>
            <div className="welcome-background">
                {/* Animated Background Spheres */}
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>
        </div>
    );
};

export default Welcome;
