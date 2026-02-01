import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './PackingList.css';

const PackingList = ({ defaultLocation }) => {
    const [destination, setDestination] = useState(defaultLocation || '');
    const [packingList, setPackingList] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checkedItems, setCheckedItems] = useState({});

    // Initialize Gemini
    const getGeminiModel = () => {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Gemini API Key is missing!");
            return null;
        }
        const genAI = new GoogleGenerativeAI(apiKey);
        return genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    };

    // Update local state if prop changes
    useEffect(() => {
        if (defaultLocation) {
            setDestination(defaultLocation);
        }
    }, [defaultLocation]);

    const generateList = async () => {
        if (!destination) return;
        setLoading(true);
        setPackingList(null);

        try {
            const model = getGeminiModel();
            if (!model) {
                alert("Gemini API Key is missing. Check your .env file.");
                return;
            }

            const prompt = `Generate a smart packing list for a trip to ${destination}. 
            Return the response STRICTLY as a valid JSON object with this structure: 
            { "categories": [ { "name": "Category Name", "items": ["item1", "item2"] } ] }. 
            Do NOT include markdown formatting like \`\`\`json. Only return the raw JSON string.`;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            console.log("Gemini Raw Response:", text); // Debugging

            // Robust JSON Extraction
            const jsonStartIndex = text.indexOf('{');
            const jsonEndIndex = text.lastIndexOf('}');

            if (jsonStartIndex === -1 || jsonEndIndex === -1) {
                throw new Error("Invalid JSON format received from AI");
            }

            const cleanJson = text.substring(jsonStartIndex, jsonEndIndex + 1);

            const data = JSON.parse(cleanJson);
            setPackingList(data.categories);
            setCheckedItems({}); // Reset checks

        } catch (error) {
            console.error("Error generating packing list:", error);
            // Show the actual error message to the user
            alert(`Failed: ${error.message || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleItem = (categoryIndex, itemIndex) => {
        const key = `${categoryIndex}-${itemIndex}`;
        setCheckedItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    return (
        <div className="packing-tool-card">
            <div className="packing-header">
                <h3>🎒 AI Smart Packing</h3>
            </div>

            <div className="packing-input-group">
                <input
                    type="text"
                    className="packing-input"
                    placeholder="Where are you going?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateList()}
                />
                <button
                    className="generate-btn"
                    onClick={generateList}
                    disabled={loading || !destination}
                >
                    {loading ? <span className="loading-spinner"></span> : 'Generate'}
                </button>
            </div>

            {packingList ? (
                <div className="list-container">
                    {packingList.map((category, catIdx) => (
                        <div key={catIdx} className="category-group">
                            <span className="category-title">{category.name}</span>
                            <div className="items-grid">
                                {category.items.map((item, itemIdx) => {
                                    const isChecked = checkedItems[`${catIdx}-${itemIdx}`];
                                    return (
                                        <label key={itemIdx} className={`checkbox-item ${isChecked ? 'checked' : ''}`}>
                                            <input
                                                type="checkbox"
                                                checked={!!isChecked}
                                                onChange={() => toggleItem(catIdx, itemIdx)}
                                            />
                                            <span>{item}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="empty-packing-state">
                    Enter your destination above to get a personalized packing checklist powered by AI.
                </div>
            )}
        </div>
    );
};

export default PackingList;
