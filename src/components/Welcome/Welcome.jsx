import React, { useState } from 'react';
import './Welcome.css';

const Welcome = ({ onStart }) => {
    const [email, setEmail] = useState('');

    const handleGetStarted = () => {
        console.log('Getting started with:', email);
        if (onStart) {
            onStart();
        }
    };

    return (
        <div className="welcome-container">
            {/* Navigation */}
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">
                        <span className="logo-icon">✈️</span>
                        <span className="logo-text">FairFare</span>
                    </div>
                    <div className="nav-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it Works</a>
                        <a href="#pricing">Pricing</a>
                        <button className="nav-login-btn">Login</button>
                        <button className="nav-signup-btn">Sign Up</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-left">
                        <h1 className="hero-title">
                            Travel Smarter,
                            <span className="hero-title-gradient"> Spend Better</span>
                        </h1>
                        <p className="hero-subtitle">
                            Track your travel expenses in real-time, get AI-powered fair price alerts,
                            and never overpay again. Your intelligent travel companion for budget-conscious explorers.
                        </p>

                        <div className="hero-form">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="hero-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button onClick={handleGetStarted} className="hero-cta-btn">
                                Get Started Free
                                <span className="btn-arrow">→</span>
                            </button>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <div className="stat-number">50K+</div>
                                <div className="stat-label">Active Travelers</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">150+</div>
                                <div className="stat-label">Cities Covered</div>
                            </div>
                            <div className="stat-item">
                                <div className="stat-number">₹2Cr+</div>
                                <div className="stat-label">Money Saved</div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="dashboard-preview">
                            <div className="preview-header">
                                <div className="preview-dots">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                </div>
                            </div>
                            <div className="preview-content">
                                <div className="preview-card floating-1">
                                    <div className="card-icon">💰</div>
                                    <div className="card-text">
                                        <div className="card-title">Daily Budget</div>
                                        <div className="card-amount">₹2,000</div>
                                    </div>
                                </div>
                                <div className="preview-card floating-2">
                                    <div className="card-icon">✨</div>
                                    <div className="card-text">
                                        <div className="card-title">AI Fair Price Alert</div>
                                        <div className="card-desc">Save 30% on transport</div>
                                    </div>
                                </div>
                                <div className="preview-card floating-3">
                                    <div className="card-icon">📍</div>
                                    <div className="card-text">
                                        <div className="card-title">Mumbai, India</div>
                                        <div className="card-desc">Current Location</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <h2 className="section-title">Everything You Need to Travel Smart</h2>
                <p className="section-subtitle">Powerful features designed for modern travelers</p>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📊</div>
                        <h3 className="feature-title">Real-Time Tracking</h3>
                        <p className="feature-description">
                            Monitor your expenses as they happen. See exactly where your money goes with beautiful visualizations.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3 className="feature-title">AI Price Intelligence</h3>
                        <p className="feature-description">
                            Get instant fair price alerts powered by AI. Know if you're paying too much before you spend.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🍜</div>
                        <h3 className="feature-title">Local Recommendations</h3>
                        <p className="feature-description">
                            Discover cheap eats and hidden gems. Save money while experiencing authentic local culture.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🚕</div>
                        <h3 className="feature-title">Transport Optimizer</h3>
                        <p className="feature-description">
                            Compare prices across all transport options. Always choose the most cost-effective way to travel.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">📱</div>
                        <h3 className="feature-title">Works Offline</h3>
                        <p className="feature-description">
                            Track expenses even without internet. Your data syncs automatically when you're back online.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">🔒</div>
                        <h3 className="feature-title">Secure & Private</h3>
                        <p className="feature-description">
                            Your financial data is encrypted and secure. We never share your information with third parties.
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Ready to Transform Your Travel?</h2>
                    <p className="cta-subtitle">Join thousands of smart travelers saving money every day</p>
                    <button className="cta-button" onClick={handleGetStarted}>
                        Start Your Journey
                        <span className="btn-arrow">→</span>
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <div className="footer-logo">
                            <span className="logo-icon">✈️</span>
                            <span className="logo-text">FairFare</span>
                        </div>
                        <p className="footer-tagline">Smart spending for smart travelers</p>
                    </div>
                    <div className="footer-right">
                        <p className="footer-copyright">© 2026 FairFare. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
