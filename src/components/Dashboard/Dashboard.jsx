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
    doc,
    getDoc
} from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

    // Form State
    const [itemName, setItemName] = useState('');
    const [cost, setCost] = useState('');
    const [city, setCity] = useState(initialTripData?.location || '');

    // Loading & Alert State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [warningMessage, setWarningMessage] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    // Load Expenses & Listen to DB
    useEffect(() => {
        if (!user?.uid) return;

        // 1. Initial Load from LocalStorage (Fast render & Offline support)
        const localExpensesKey = `expenses_${user.uid}`;
        const cachedExpenses = localStorage.getItem(localExpensesKey);
        if (cachedExpenses) {
            try {
                const parsed = JSON.parse(cachedExpenses);
                // Convert stored timestamps back to Date objects if needed (though map helps)
                // We keep them as is, UI handles potentially missing toDate()
                if (parsed.length > 0) setExpenses(parsed);
            } catch (e) {
                console.error("Error parsing local expenses:", e);
            }
        }

        // Fetch Trip Details
        const fetchTrip = async () => {
            try {
                const tripDoc = await getDoc(doc(db, "trips", user.uid));
                if (tripDoc.exists()) {
                    const tripData = tripDoc.data();
                    setTotalBudget(tripData.budget || 5000);
                    setCity(tripData.location || '');
                }
            } catch (error) {
                console.error("Error fetching trip:", error);
            }
        };

        fetchTrip();

        // Listen to User's Expenses Subcollection
        const expensesRef = collection(db, "trips", user.uid, "expenses");
        const q = query(expensesRef, orderBy("timestamp", "desc"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expensesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // If DB has data, update state and cache
            setExpenses(expensesData);
            // Always update local storage to reflect the latest state from DB
            localStorage.setItem(localExpensesKey, JSON.stringify(expensesData));
        }, (error) => {
            console.error("Error listening to expenses (using local cache):", error);
        });

        return () => unsubscribe();
    }, [user]);

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
        if (!user?.uid) return;

        const newExpense = {
            id: Date.now().toString(),
            name: itemName,
            cost: Number(cost),
            city: city,
            timestamp: new Date() // Store as object/date
        };

        // 1. Optimistic Update
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);

        // 2. Save to Local Cache (Manual Persistence)
        const localExpensesKey = `expenses_${user.uid}`;
        // We strip methods or complexity before JSON stringify if needed, but simple objects are fine
        localStorage.setItem(localExpensesKey, JSON.stringify(updatedExpenses));

        // Reset form
        setItemName('');
        setCost('');
        setShowWarning(false);
        setWarningMessage(null);

        try {
            const expensesRef = collection(db, "trips", user.uid, "expenses");
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
    const progressPercentage = Math.min((currentSpend / totalBudget) * 100, 100);
    const remainingBudget = totalBudget - currentSpend;

    return (
        <div className="dashboard-layout">
            {/* Sidebar (Visual) */}
            <aside className="sidebar">
                <div className="logo-area">
                    <h2>FairFare</h2>
                </div>
                <nav className="nav-menu">
                    <div className="nav-item active">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                        <span>Dashboard</span>
                    </div>
                    <div className="nav-item">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                        <span>Wallet</span>
                    </div>
                    <div className="nav-item">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        <span>Analytics</span>
                    </div>
                    <div className="nav-item new-plan-btn" onClick={onNewPlan} style={{ marginTop: 'auto', marginBottom: '20px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#a78bfa' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        <span>New Plan</span>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="top-header">
                    <div>
                        <h1>Welcome back, {user?.displayName ? user.displayName.split(' ')[0] : 'Traveler'}!</h1>
                        <p className="date-text">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="user-profile">
                        <div className="avatar">{user && user.displayName ? user.displayName[0].toUpperCase() : 'T'}</div>
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
                                    <span>{Math.round(progressPercentage)}% Used</span>
                                    <span>₹{remainingBudget} left</span>
                                </div>
                                <div className="progress-track">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${progressPercentage}%`,
                                            backgroundColor: remainingBudget < 0 ? '#ff4d4d' : '#8B5CF6'
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
                                    />
                                </div>
                                <button type="submit" disabled={isAnalyzing} className="submit-btn">
                                    {isAnalyzing ? (
                                        <>
                                            <span className="spinner"></span> Analyzing...
                                        </>
                                    ) : (
                                        <>+ Add Expense</>
                                    )}
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
            </main>
        </div>
    );
};

export default Dashboard;
