import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import CurrencyConverter from '../CurrencyConverter';
import { db } from '../../config/firebase';
import {
    collection,
    onSnapshot,
    addDoc,
    query,
    orderBy,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Analytics from '../Analytics/Analytics';

// Initialize Gemini API (Safe initialization)
const getGeminiModel = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        console.error("Gemini API Key is missing!");
        return null;
    }
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
};

const Dashboard = ({ user, initialTripData, onNewPlan }) => {
    console.log("Dashboard rendering with user:", user);

    // State
    const [totalBudget, setTotalBudget] = useState(initialTripData?.budget || 5000);
    const [expenses, setExpenses] = useState([]);
    const [currentSpend, setCurrentSpend] = useState(0);
    const [tripPlan, setTripPlan] = useState(initialTripData?.recommendations || null);
    const [activeTab, setActiveTab] = useState('places');

    // Multi-trip support
    const [allTrips, setAllTrips] = useState([]);
    const [currentTripId, setCurrentTripId] = useState(initialTripData?.id || null);
    const [isCompleted, setIsCompleted] = useState(initialTripData?.status === 'completed');

    // Form State
    const [itemName, setItemName] = useState('');
    const [cost, setCost] = useState('');
    const [city, setCity] = useState(initialTripData?.location || '');

    // Loading & Alert State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [warningMessage, setWarningMessage] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    // View State (Dashboard vs Analytics)
    const [dashboardView, setDashboardView] = useState('overview');

    // Fetch All User Trips (Sidebar list) & Refresh on View Change
    useEffect(() => {
        if (!user?.uid) return;

        const fetchTrips = async () => {
            try {
                const q = query(collection(db, "trips"), where("userId", "==", user.uid));
                const snapshot = await getDocs(q);
                const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Sort by createdAt desc to match expected order
                trips.sort((a, b) => {
                    const tA = a.createdAt?.seconds || 0;
                    const tB = b.createdAt?.seconds || 0;
                    return tB - tA;
                });

                setAllTrips(trips);
            } catch (error) {
                console.error("Error fetching trips list:", error);
            }
        };

        // Fetch on mount OR when switching to analytics to ensure freshness
        if (allTrips.length === 0 || dashboardView === 'analytics') {
            fetchTrips();
        }
    }, [user, dashboardView]);

    // Switch Trip Handler
    const handleSwitchTrip = (trip) => {
        setCurrentTripId(trip.id);
        setTotalBudget(trip.budget || 5000);
        setCity(trip.location || '');
        setTripPlan(trip.recommendations || null);
        setIsCompleted(trip.status === 'completed');
        setDashboardView('overview'); // Switch to overview when a trip is selected
        // Expenses will auto-reload due to useEffect dependency on currentTripId
    };

    // End Trip Handler
    const handleEndTrip = async () => {
        if (!currentTripId) return;
        if (window.confirm("Are you sure you want to end this trip? You won't be able to add more expenses.")) {

            // 1. Optimistic UI Update
            setIsCompleted(true);
            // Loose comparison in case of string/number mismatch, though IDs should be strings
            setAllTrips(prev => prev.map(t => (t.id == currentTripId) ? { ...t, status: 'completed' } : t));

            // 2. Update LocalStorage
            const localTripJson = localStorage.getItem('currentTrip');
            if (localTripJson) {
                try {
                    const localTrip = JSON.parse(localTripJson);
                    if (localTrip.id == currentTripId) {
                        localTrip.status = 'completed';
                        localStorage.setItem('currentTrip', JSON.stringify(localTrip));
                    }
                } catch (e) { /* ignore */ }
            }

            // 3. Database Update & Sync
            if (!currentTripId.toString().startsWith('local_')) {
                try {
                    await updateDoc(doc(db, "trips", currentTripId), { status: 'completed' });

                    // Force re-fetch from DB to ensure Analytics is 100% in sync
                    if (user?.uid) {
                        const q = query(collection(db, "trips"), where("userId", "==", user.uid));
                        getDocs(q).then(snapshot => {
                            const trips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                            setAllTrips(trips);
                        });
                    }
                } catch (error) {
                    console.warn("Could not sync 'completed' status/list to server.", error);
                }
            }
        }
    };

    // Load Expenses & Listen to DB (Depends on currentTripId)
    useEffect(() => {
        if (!user?.uid || !currentTripId) return;

        const localExpensesKey = `expenses_${currentTripId}`;
        const cachedExpenses = localStorage.getItem(localExpensesKey);
        if (cachedExpenses) {
            try {
                const parsed = JSON.parse(cachedExpenses);
                if (parsed.length > 0) setExpenses(parsed);
                else setExpenses([]); // Clear if empty
            } catch (e) {
                console.error("Error parsing local expenses:", e);
            }
        } else {
            setExpenses([]); // Clear previous trip expenses if no cache
        }

        // Listen to Current Trip's Expenses Subcollection
        // OLD: collection(db, "trips", user.uid, "expenses")
        // NEW: collection(db, "trips", currentTripId, "expenses")
        const expensesRef = collection(db, "trips", currentTripId, "expenses");
        const q = query(expensesRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expensesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setExpenses(expensesData);
            localStorage.setItem(localExpensesKey, JSON.stringify(expensesData));
        }, (error) => {
            console.error("Error listening to expenses:", error);
        });

        return () => unsubscribe();
    }, [user, currentTripId]); // Re-run when trip ID changes

    // Recalculate totals whenever expenses change (Optimistic UI support)
    useEffect(() => {
        const total = expenses.reduce((acc, curr) => acc + Number(curr.cost), 0);
        setCurrentSpend(total);
    }, [expenses]);

    // AI Guardrail Function
    const checkFairPrice = async (item, itemCost, location) => {
        setIsAnalyzing(true);
        try {
            const model = getGeminiModel();
            if (!model) {
                console.warn("Gemini model not available (missing key?)");
                return true; // Skip check if no key
            }

            const prompt = `I am a tourist in ${location}. I am paying ${itemCost} for ${item}. Is this fair, expensive, or cheap for a budget traveler? Answer in one short sentence starting with 'Fair', 'Expensive', or 'Cheap'.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log("Gemini Response:", text);

            if (text.toLowerCase().includes("expensive")) {
                setWarningMessage(text);
                setShowWarning(true);
                return false; // Indicating expensive/warning
            }
            return true; // Indicating fair/cheap
        } catch (error) {
            console.error("Error talking to Gemini:", error);
            return true;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!itemName || !cost || !city) return;

        const isFair = await checkFairPrice(itemName, cost, city);

        if (isFair) {
            saveExpense();
        }
    };

    const saveExpense = async () => {
        if (!user?.uid || !currentTripId) return;

        const newExpense = {
            id: Date.now().toString(),
            name: itemName,
            cost: Number(cost),
            city: city,
            timestamp: new Date()
        };

        // 1. Optimistic Update
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);

        // 2. Save to Local Cache (Manual Persistence)
        const localExpensesKey = `expenses_${currentTripId}`;
        localStorage.setItem(localExpensesKey, JSON.stringify(updatedExpenses));

        // Reset form
        setItemName('');
        setCost('');
        setShowWarning(false);
        setWarningMessage(null);

        try {
            const expensesRef = collection(db, "trips", currentTripId, "expenses");
            await addDoc(expensesRef, {
                name: itemName,
                cost: Number(cost),
                city: city,
                timestamp: new Date()
            });
        } catch (error) {
            console.error("Error adding document (saved locally in session): ", error);
        }
    };

    // Calculations
    const progressPercentage = isCompleted ? 100 : Math.min((currentSpend / totalBudget) * 100, 100);
    const remainingBudget = totalBudget - currentSpend;

    return (
        <div className="dashboard-layout">
            {/* Sidebar (Visual) */}
            <aside className="sidebar">
                <div className="logo-area">
                    <h2>FairFare</h2>
                </div>
                <nav className="nav-menu">
                    <div className={`nav-item ${dashboardView === 'overview' ? 'active' : ''}`} onClick={() => setDashboardView('overview')}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span>Dashboard</span>
                    </div>
                    <div className="nav-item">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                        <span>Wallet</span>
                    </div>
                    <div className={`nav-item ${dashboardView === 'analytics' ? 'active' : ''}`} onClick={() => setDashboardView('analytics')}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <span>Analytics</span>
                    </div>

                    {/* My Trips List */}
                    {allTrips.length > 0 && (
                        <div className="trips-list" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                            <h4 style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', paddingLeft: '0.5rem' }}>My Trips</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                                {allTrips.map(trip => (
                                    <div
                                        key={trip.id}
                                        onClick={() => handleSwitchTrip(trip)}
                                        className={`nav-item ${currentTripId === trip.id ? 'active' : ''}`}
                                        style={{ fontSize: '0.9rem', padding: '0.5rem 0.75rem' }}
                                    >
                                        <span style={{ width: '20px', textAlign: 'center' }}>✈️</span>
                                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                                            {trip.location}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="nav-item new-plan-btn" onClick={onNewPlan} style={{ marginTop: 'auto', marginBottom: '20px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#a78bfa' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        <span>New Plan</span>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                {dashboardView === 'overview' ? (
                    <>
                        <header className="top-header">
                            <div>
                                <h1>Welcome back, {user?.displayName ? user.displayName.split(' ')[0] : 'Traveler'}!</h1>
                                <p className="date-text">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>

                            <div className="header-actions" style={{ marginRight: '180px' }}>
                                {currentTripId && (
                                    isCompleted ? (
                                        <span className="status-badge completed" style={{ background: '#d1fae5', color: '#065f46', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                            ✅ Trip Completed
                                        </span>
                                    ) : (
                                        <button onClick={handleEndTrip} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}>
                                            End Trip
                                        </button>
                                    )
                                )}
                            </div>
                        </header>

                        {/* Warning Alert */}
                        {showWarning && (
                            <div className="warning-overlay">
                                <div className="warning-modal">
                                    <div className="warning-icon">
                                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    </div>
                                    <h3>Price Alert!</h3>
                                    <p>{warningMessage}</p>
                                    <div className="warning-actions">
                                        <button className="btn-cancel" onClick={() => setShowWarning(false)}>Cancel</button>
                                        <button className="btn-proceed" onClick={saveExpense}>Proceed Anyway</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Trip Plan Section */}
                        {tripPlan && (
                            <div className="plan-section">
                                <div className="plan-header">
                                    <h3>{isCompleted ? `✅ Trip to ${city} Completed` : 'Your AI Travel Plan'}</h3>
                                    <div className="plan-tabs">
                                        <button className={activeTab === 'places' ? 'active' : ''} onClick={() => setActiveTab('places')}>🏝️ Places</button>
                                        <button className={activeTab === 'food' ? 'active' : ''} onClick={() => setActiveTab('food')}>🍜 Food</button>
                                        <button className={activeTab === 'stays' ? 'active' : ''} onClick={() => setActiveTab('stays')}>🏨 Stays</button>
                                    </div>
                                </div>
                                <div className="plan-content">
                                    {activeTab === 'places' && tripPlan.places?.map((place, idx) => (
                                        <div key={idx} className="plan-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <h4>{place.name}</h4>
                                                <span className="plan-cost">🎟️ {place.ticket}</span>
                                            </div>
                                            {(place.rating || place.location) && (
                                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                                    {place.rating && <>⭐ <strong>{place.rating}</strong></>}
                                                    {place.rating && place.location && ' • '}
                                                    {place.location && <>📍 {place.location}</>}
                                                </p>
                                            )}
                                            <p style={{ marginTop: '8px' }}>{place.desc}</p>
                                        </div>
                                    ))}
                                    {activeTab === 'food' && tripPlan.food?.map((item, idx) => (
                                        <div key={idx} className="plan-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <h4>{item.name}</h4>
                                                <span className="plan-cost">💵 {item.cost}</span>
                                            </div>
                                            {(item.rating || item.location) && (
                                                <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                                    {item.rating && <>⭐ <strong>{item.rating}</strong></>}
                                                    {item.rating && item.location && ' • '}
                                                    {item.location && <>📍 {item.location}</>}
                                                </p>
                                            )}
                                            <p style={{ marginTop: '8px' }}>{item.desc}</p>
                                        </div>
                                    ))}
                                    {activeTab === 'stays' && tripPlan.stays?.map((stay, idx) => (
                                        <div key={idx} className="plan-card">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                                <h4>{stay.name}</h4>
                                                <span className="plan-cost">🌙 {stay.price}</span>
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                                ⭐ <strong>{stay.rating}</strong> • 📍 {stay.location}
                                            </p>
                                            <p style={{ marginTop: '8px' }}>{stay.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary Cards */}
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon budget-icon">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Budget</span>
                                    <span className="stat-value">₹{totalBudget}</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon spend-icon">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Total Spent</span>
                                    <span className="stat-value">₹{currentSpend}</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon remaining-icon">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                </div>
                                <div className="stat-info">
                                    <span className="stat-label">Remaining</span>
                                    <span className="stat-value" style={{ color: remainingBudget < 0 ? '#ff4d4d' : 'inherit' }}>₹{remainingBudget}</span>
                                </div>
                            </div>
                        </div>

                        <div className="content-grid">
                            {/* Left Column: Actions & Progress */}
                            <div className="left-column">
                                <div className="card budget-progress-card">
                                    <h3>Budget Health</h3>
                                    <div className="progress-container">
                                        <div className="progress-labels">
                                            <span>{isCompleted ? 'Trip Completed' : `${Math.round(progressPercentage)}% Used`}</span>
                                            <span>₹{remainingBudget} left</span>
                                        </div>
                                        <div className="progress-track">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width: `${progressPercentage}%`,
                                                    backgroundColor: isCompleted ? '#10b981' : (remainingBudget < 0 ? '#ff4d4d' : '#8B5CF6')
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card add-expense-card">
                                    <h3>Add New Expense</h3>
                                    <form onSubmit={handleAddExpense} className="expense-form">
                                        <div className="form-group">
                                            <label>Location</label>
                                            <input
                                                type="text"
                                                placeholder="City (e.g., Goa)"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required
                                                disabled={isCompleted}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Item / Service</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Taxi"
                                                value={itemName}
                                                onChange={(e) => setItemName(e.target.value)}
                                                required
                                                disabled={isCompleted}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Cost</label>
                                            <input
                                                type="number"
                                                placeholder="₹ Amount"
                                                value={cost}
                                                onChange={(e) => setCost(e.target.value)}
                                                required
                                                disabled={isCompleted}
                                            />
                                        </div>
                                        <button type="submit" disabled={isAnalyzing || isCompleted} className="submit-btn" style={isCompleted ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
                                            {isCompleted ? 'Trip Closed' : (isAnalyzing ? (
                                                <>
                                                    <span className="spinner"></span> Analyzing...
                                                </>
                                            ) : (
                                                <>+ Add Expense</>
                                            ))}
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Right Column: Recent Activity */}
                            <div className="right-column">
                                <CurrencyConverter />
                                <div className="card recent-activity-card">
                                    <h3>Recent Activity</h3>
                                    {expenses.length === 0 ? (
                                        <div className="empty-state">
                                            <svg width="48" height="48" fill="none" stroke="#ccc" strokeWidth="1" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                            <p>No expenses yet. Add one to get started!</p>
                                        </div>
                                    ) : (
                                        <ul className="activity-list">
                                            {expenses.map((expense) => (
                                                <li key={expense.id} className="activity-item">
                                                    <div className="activity-icon">
                                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                                    </div>
                                                    <div className="activity-details">
                                                        <span className="activity-name">{expense.name}</span>
                                                        <span className="activity-meta">{expense.city} • {expense.timestamp?.toDate ? expense.timestamp.toDate().toLocaleDateString() : 'Just now'}</span>
                                                    </div>
                                                    <span className="activity-amount">-₹{expense.cost}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <Analytics allTrips={allTrips} onSwitchTrip={handleSwitchTrip} onBack={() => setDashboardView('overview')} />
                )}
            </main>
        </div>
    );
};

export default Dashboard;
