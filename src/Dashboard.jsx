import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { db } from './firebase'; // Adjust path if needed
import {
    collection,
    onSnapshot,
    addDoc,
    query,
    orderBy
} from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY");

const Dashboard = () => {
    // State
    const [totalBudget, setTotalBudget] = useState(5000);
    const [expenses, setExpenses] = useState([]);
    const [currentSpend, setCurrentSpend] = useState(0);

    // Form State
    const [itemName, setItemName] = useState('');
    const [cost, setCost] = useState('');
    const [city, setCity] = useState('');

    // Loading & Alert State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [warningMessage, setWarningMessage] = useState(null);
    const [showWarning, setShowWarning] = useState(false);

    // Fetch Expenses Real-time
    useEffect(() => {
        const q = query(collection(db, "expenses"), orderBy("timestamp", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const expensesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setExpenses(expensesData);

            // Calculate total spend
            const total = expensesData.reduce((acc, curr) => acc + Number(curr.cost), 0);
            setCurrentSpend(total);
        });

        return () => unsubscribe();
    }, []);

    // AI Guardrail Function
    const checkFairPrice = async (item, itemCost, location) => {
        setIsAnalyzing(true);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const prompt = `I am a tourist in ${location}. I am paying ${itemCost} for ${item}. Is this fair, expensive, or cheap? Answer in one short sentence.`;

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
            // Fallback: allow if AI fails? or assume fair?
            return true;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        if (!itemName || !cost || !city) return;

        // 1. Check Fair Price first
        const isFair = await checkFairPrice(itemName, cost, city);

        // If expensive, we stop here. User must consciously click "Proceed Anyway" (not implemented in simple flow)
        // or we just show warning and they can try again or we can have a mechanism to bypass.
        // Requirement says: "If Gemini says it is 'Expensive', show a specific Warning UI (red alert box) before the user saves the expense."
        // implying we don't save immediately.

        if (isFair) {
            saveExpense();
        }
    };

    const saveExpense = async () => {
        try {
            await addDoc(collection(db, "expenses"), {
                name: itemName,
                cost: Number(cost),
                city: city,
                timestamp: new Date()
            });
            // Reset form
            setItemName('');
            setCost('');
            setShowWarning(false);
            setWarningMessage(null);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    // Progress Bar Calculation
    const progressPercentage = Math.min((currentSpend / totalBudget) * 100, 100);
    const remainingBudget = totalBudget - currentSpend;

    return (
        <div className="dashboard-container">
            <header className="header">
                <h1>FairFare</h1>
                <p>Smart Budget Travel Assistant</p>
            </header>

            {/* Budget Visualization */}
            <div className="card budget-card">
                <h2>Total Budget: ₹{totalBudget}</h2>
                <div className="progress-bar-container">
                    <div
                        className="progress-bar-fill"
                        style={{
                            width: `${progressPercentage}%`,
                            backgroundColor: remainingBudget < 0 ? '#ff4d4d' : '#4caf50'
                        }}
                    ></div>
                </div>
                <div className="budget-stats">
                    <span>Spent: ₹{currentSpend}</span>
                    <span>Remaining: ₹{remainingBudget}</span>
                </div>
            </div>

            {/* Expense Form */}
            <div className="card form-card">
                <h3>Add New Expense</h3>
                <form onSubmit={handleAddExpense}>
                    <input
                        type="text"
                        placeholder="City (e.g., Mumbai)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Item Name (e.g., Taxi Ride)"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Cost (₹)"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={isAnalyzing} className="add-btn">
                        {isAnalyzing ? 'Analyzing...' : 'Add Expense'}
                    </button>
                </form>
            </div>

            {/* Warning UI */}
            {showWarning && (
                <div className="warning-box">
                    <h4>⚠️ Artificial Intelligence Alert</h4>
                    <p>{warningMessage}</p>
                    <div className="warning-actions">
                        <button
                            onClick={() => setShowWarning(false)}
                            className="cancel-btn"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={saveExpense}
                            className="proceed-btn"
                        >
                            Proceed Anyway
                        </button>
                    </div>
                </div>
            )}

            {/* Expense List */}
            <div className="card list-card">
                <h3>Recent Expenses</h3>
                {expenses.length === 0 ? (
                    <p className="no-data">No expenses logged yet.</p>
                ) : (
                    <ul className="expense-list">
                        {expenses.map((expense) => (
                            <li key={expense.id} className="expense-item">
                                <div className="expense-info">
                                    <span className="expense-name">{expense.name}</span>
                                    <span className="expense-city">{expense.city}</span>
                                </div>
                                <span className="expense-cost">₹{expense.cost}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
