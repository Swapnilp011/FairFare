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
        <div className="homepage-container">
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
                        <button className="nav-login-btn">Login</button>
                        <button className="nav-signup-btn" onClick={handleGetStarted}>Get Started</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-left">
                        <div className="hero-badge">🎯 Smart Travel Budgeting Made Simple</div>
                        <h1 className="hero-title">
                            Never Overpay While
                            <span className="hero-title-gradient"> Traveling Again</span>
                        </h1>
                        <p className="hero-subtitle">
                            FairFare is your AI-powered travel companion that tracks expenses, alerts you to unfair prices,
                            and helps you find the best deals in real-time. Travel smarter, not harder.
                        </p>

                        <div className="hero-form">
                            <input
                                type="email"
                                placeholder="Enter your email to get started"
                                className="hero-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button onClick={handleGetStarted} className="hero-cta-btn">
                                Get Started Free
                                <span className="btn-arrow">→</span>
                            </button>
                        </div>

                        <div className="hero-trust">
                            <span className="trust-text">✓ No credit card required</span>
                            <span className="trust-text">✓ Forever Free</span>
                            <span className="trust-text">✓ Open for Everyone</span>
                        </div>
                    </div>

                    <div className="hero-right">
                        <div className="phone-mockup">
                            <div className="phone-screen">
                                <div className="app-header">
                                    <div className="app-time">9:41</div>
                                    <div className="app-icons">📶 🔋</div>
                                </div>
                                <div className="app-content">
                                    <div className="budget-circle">
                                        <div className="circle-inner">
                                            <div className="remaining">₹1,150</div>
                                            <div className="remaining-label">Remaining Today</div>
                                        </div>
                                    </div>
                                    <div className="alert-card">
                                        <div className="alert-icon">⚠️</div>
                                        <div className="alert-text">
                                            <strong>Price Alert!</strong>
                                            <p>This auto ride costs ₹45/km. Fair price is ₹20/km</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="stats-bar">
                    <div className="stat-item">
                        <div className="stat-number">50,000+</div>
                        <div className="stat-label">Active Travelers</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">150+</div>
                        <div className="stat-label">Cities Worldwide</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">₹2 Crore+</div>
                        <div className="stat-label">Money Saved</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                        <div className="stat-number">4.9/5</div>
                        <div className="stat-label">User Rating</div>
                    </div>
                </div>
            </section>

            {/* Problem Solution Section */}
            <section className="problem-section">
                <div className="problem-content">
                    <h2 className="section-title">The Problem with Travel Spending</h2>
                    <div className="problem-grid">
                        <div className="problem-card">
                            <div className="problem-icon">😰</div>
                            <h3>Getting Overcharged</h3>
                            <p>Tourists pay 2-3x more than locals for the same services. Taxi drivers, vendors, and restaurants often exploit lack of local knowledge.</p>
                        </div>
                        <div className="problem-card">
                            <div className="problem-icon">📊</div>
                            <h3>Budget Confusion</h3>
                            <p>Hard to track daily spending across multiple currencies, cash payments, and digital transactions in unfamiliar places.</p>
                        </div>
                        <div className="problem-card">
                            <div className="problem-icon">🤷</div>
                            <h3>No Local Knowledge</h3>
                            <p>Visitors don't know fair prices, cheap authentic restaurants, or best transport options that locals use daily.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section" id="how-it-works">
                <h2 className="section-title">How FairFare Works</h2>
                <p className="section-subtitle">Your 24/7 travel money assistant in 3 simple steps</p>

                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <div className="step-icon">📍</div>
                        <h3 className="step-title">Set Your Destination & Budget</h3>
                        <p className="step-description">
                            Tell us where you're traveling and your daily budget. FairFare automatically loads local price data for that city.
                        </p>
                        <div className="step-example">
                            <div className="example-box">
                                <span className="example-label">Example:</span>
                                <span className="example-text">Traveling to Mumbai with ₹2,000/day budget</span>
                            </div>
                        </div>
                    </div>

                    <div className="step-arrow">→</div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <div className="step-icon">📱</div>
                        <h3 className="step-title">Log Expenses Instantly</h3>
                        <p className="step-description">
                            Quick-add expenses as you spend. Snap a photo of receipts or use voice input. FairFare tracks everything in real-time.
                        </p>
                        <div className="step-example">
                            <div className="example-box">
                                <span className="example-label">You log:</span>
                                <span className="example-text">Auto ride - ₹250 for 5km</span>
                            </div>
                        </div>
                    </div>

                    <div className="step-arrow">→</div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <div className="step-icon">🤖</div>
                        <h3 className="step-title">Get Instant AI Alerts</h3>
                        <p className="step-description">
                            Our AI compares your expense to local fair prices. Get immediate alerts if you're being overcharged, plus better alternatives.
                        </p>
                        <div className="step-example alert-example">
                            <div className="example-box alert-box">
                                <span className="alert-emoji">⚠️</span>
                                <div>
                                    <div className="alert-title">Price Alert!</div>
                                    <div className="alert-detail">You paid ₹50/km. Fair price: ₹20/km</div>
                                    <div className="alert-tip">💡 Next time, use Ola/Uber or negotiate before riding</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section" id="features">
                <h2 className="section-title">Everything You Need to Travel Smart</h2>
                <p className="section-subtitle">Powerful features that save you money every day</p>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon-large">🎯</div>
                        <h3 className="feature-title">Real-Time Price Alerts</h3>
                        <p className="feature-description">
                            Instantly know if you're being overcharged. Our AI compares your expenses against millions of data points from local travelers.
                        </p>
                        <div className="feature-highlight">
                            <span className="highlight-text">Save 20-40% on average</span>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-large">📊</div>
                        <h3 className="feature-title">Smart Budget Tracking</h3>
                        <p className="feature-description">
                            See your daily spending at a glance with beautiful visualizations. Know exactly how much you have left before overspending.
                        </p>
                        <div className="feature-highlight">
                            <span className="highlight-text">Never exceed your budget</span>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-large">🍜</div>
                        <h3 className="feature-title">Local Cheap Eats Finder</h3>
                        <p className="feature-description">
                            Find authentic local restaurants where residents actually eat. Filter by cuisine, price range, and distance from your location.
                        </p>
                        <div className="feature-highlight">
                            <span className="highlight-text">Eat like a local, not a tourist</span>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-large">🚕</div>
                        <h3 className="feature-title">Transport Price Comparison</h3>
                        <p className="feature-description">
                            Compare auto, taxi, Uber, Ola, and public transport costs in real-time. Always choose the cheapest, safest option.
                        </p>
                        <div className="feature-highlight">
                            <span className="highlight-text">Best transport every time</span>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-large">💬</div>
                        <h3 className="feature-title">Negotiation Scripts</h3>
                        <p className="feature-description">
                            Get local language phrases and negotiation tips. Know what to say to get fair prices from vendors and drivers.
                        </p>
                        <div className="feature-highlight">
                            <span className="highlight-text">Negotiate like a pro</span>
                        </div>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon-large">📱</div>
                        <h3 className="feature-title">Works Offline</h3>
                        <p className="feature-description">
                            All fair price data downloads to your phone. Track expenses and get alerts even without internet connection.
                        </p>
                        <div className="feature-highlight">
                            <span className="highlight-text">No internet? No problem</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Case Section */}
            <section className="use-case-section">
                <h2 className="section-title">Real Stories from Real Travelers</h2>
                <div className="use-cases-grid">
                    <div className="use-case-card">
                        <div className="quote-mark">"</div>
                        <p className="use-case-story">
                            I was about to pay ₹500 for a 3km auto ride in Delhi. FairFare alerted me that the fair price was ₹80. I showed the driver the app and negotiated down to ₹100. <strong>Saved ₹400 in 30 seconds!</strong>
                        </p>
                        <div className="use-case-author">
                            <div className="author-avatar">👨</div>
                            <div className="author-info">
                                <div className="author-name">Rajesh Kumar</div>
                                <div className="author-location">Business Traveler, Bangalore</div>
                            </div>
                        </div>
                    </div>

                    <div className="use-case-card">
                        <div className="quote-mark">"</div>
                        <p className="use-case-story">
                            As a foreign tourist in Mumbai, I had no idea what things should cost. FairFare helped me find amazing street food for ₹50 instead of touristy restaurants charging ₹500. <strong>I saved over ₹5,000 in one week!</strong>
                        </p>
                        <div className="use-case-author">
                            <div className="author-avatar">👩</div>
                            <div className="author-info">
                                <div className="author-name">Sarah Johnson</div>
                                <div className="author-location">Tourist, United States</div>
                            </div>
                        </div>
                    </div>

                    <div className="use-case-card">
                        <div className="quote-mark">"</div>
                        <p className="use-case-story">
                            I travel to different cities every month for work. FairFare keeps me under budget everywhere I go. The offline mode is a lifesaver when I don't have data. <strong>Best travel app I've ever used.</strong>
                        </p>
                        <div className="use-case-author">
                            <div className="author-avatar">👨</div>
                            <div className="author-info">
                                <div className="author-name">Amit Patel</div>
                                <div className="author-location">Sales Manager, Pune</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="final-cta-section">
                <div className="final-cta-content">
                    <h2 className="final-cta-title">Start Saving Money on Your Next Trip</h2>
                    <p className="final-cta-subtitle">Join 50,000+ smart travelers who never overpay</p>

                    <div className="cta-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="cta-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleGetStarted} className="cta-button">
                            Get Started Free
                            <span className="btn-arrow">→</span>
                        </button>
                    </div>

                    <div className="cta-benefits">
                        <div className="benefit-item">✓ Forever Free</div>
                        <div className="benefit-item">✓ No credit card required</div>
                        <div className="benefit-item">✓ Open for Everyone</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <span className="logo-icon">✈️</span>
                            <span className="logo-text">FairFare</span>
                        </div>
                        <p className="footer-tagline">Smart spending for smart travelers</p>
                        <div className="footer-social">
                            <a href="#" className="social-link">Twitter</a>
                            <a href="#" className="social-link">Instagram</a>
                            <a href="#" className="social-link">Facebook</a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Product</h4>
                        <a href="#features" className="footer-link">Features</a>
                        <a href="#how-it-works" className="footer-link">How it Works</a>
                        <a href="#" className="footer-link">FAQ</a>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Company</h4>
                        <a href="#" className="footer-link">About Us</a>
                        <a href="#" className="footer-link">Blog</a>
                        <a href="#" className="footer-link">Careers</a>
                        <a href="#" className="footer-link">Contact</a>
                    </div>

                    <div className="footer-section">
                        <h4 className="footer-heading">Legal</h4>
                        <a href="#" className="footer-link">Privacy Policy</a>
                        <a href="#" className="footer-link">Terms of Service</a>
                        <a href="#" className="footer-link">Cookie Policy</a>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">© 2026 FairFare. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Welcome;
