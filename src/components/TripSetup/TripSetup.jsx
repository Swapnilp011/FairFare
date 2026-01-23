import React, { useState } from 'react';
import './TripSetup.css';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const getGeminiModel = () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return null;
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
};

const TripSetup = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form Data
    const [location, setLocation] = useState('');
    const [purpose, setPurpose] = useState('');
    const [budget, setBudget] = useState('');
    const [duration, setDuration] = useState('1'); // Days

    const [recommendations, setRecommendations] = useState(null);

    const handleGeneratePlan = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const model = getGeminiModel();
            if (!model) throw new Error("AI Key missing");

            const prompt = `
            Plan a budget trip details for a user in ${location} for ${duration} days.
            Purpose: ${purpose}.
            Total Budget: ${user.currency || '₹'}${budget}.
            
            Return a JSON object with exactly these fields:
            {
                "food": [{"name": "Name", "cost": "approx cost", "desc": "short desc"}],
                "places": [{"name": "Name", "ticket": "ticket price", "desc": "short desc"}],
                "stays": [{"name": "Name", "price": "price per night", "desc": "short desc"}],
                "travel_tips": ["tip1", "tip2"]
            }
            Do not include markdown or backticks. Just raw JSON.
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // cleanup markdown
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();

            let data;
            try {
                data = JSON.parse(jsonString);
            } catch (jsonError) {
                // Fallback: try to find the first { and last }
                const start = text.indexOf('{');
                const end = text.lastIndexOf('}');
                if (start !== -1 && end !== -1) {
                    try {
                        data = JSON.parse(text.substring(start, end + 1));
                    } catch (e) {
                        throw new Error("AI returned invalid JSON format.");
                    }
                } else {
                    throw new Error("AI returned invalid JSON format.");
                }
            }
            setRecommendations(data);

            // Try to Save to Firestore
            try {
                await setDoc(doc(db, "trips", user.uid), {
                    userId: user.uid,
                    location,
                    purpose,
                    budget: Number(budget),
                    duration: Number(duration),
                    recommendations: data,
                    createdAt: new Date(),
                    remainingBudget: Number(budget)
                });
            } catch (dbError) {
                console.error("Database Save Error:", dbError);
                // We don't block the user if DB fails, we just warn them or proceed silently
                alert(`Plan generated! However, we couldn't save it to your history due to a permission error: ${dbError.message}. You can still view it now.`);
            }

            // Navigate to Dashboard (where the data should be passed via state if DB fetch isn't guaranteed)
            // We pass the trip object so Dashboard can use it immediately.
            onComplete({
                location,
                budget: Number(budget),
                recommendations: data
            });

        } catch (error) {
            console.error("Planning Error:", error);
            if (error.message.includes('429')) {
                alert("Deepmind AI Quota Exceeded. Please wait a minute and try again, or use a different API key.");
            } else {
                alert(`Failed to generate plan: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="setup-container">
            <div className="setup-card">
                <div className="setup-header">
                    <div className="logo-small">✈️ Trip Planner</div>
                    <h2>Plan Your Adventure</h2>
                    <p>Tell us a bit about your trip to get AI-powered suggestions.</p>
                </div>

                <form onSubmit={handleGeneratePlan} className="setup-form">
                    <div className="form-group">
                        <label>Current Location / Destination</label>
                        <input
                            type="text"
                            placeholder="e.g., Goa, India"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Purpose</label>
                            <select value={purpose} onChange={(e) => setPurpose(e.target.value)} required>
                                <option value="" disabled>Select Purpose</option>
                                <option value="Leisure">Leisure / Vacation</option>
                                <option value="Business">Business</option>
                                <option value="Bagpacking">Backpacking</option>
                                <option value="Family">Family Trip</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Duration (Days)</label>
                            <input
                                type="number"
                                min="1"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Total Budget (₹)</label>
                        <input
                            type="number"
                            placeholder="e.g., 5000"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="setup-btn" disabled={loading}>
                        {loading ? (
                            <>
                                <span className="spinner-small"></span> Generating Recommendations...
                            </>
                        ) : 'Generate & Start Trip'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TripSetup;
