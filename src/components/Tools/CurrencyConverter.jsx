import React, { useState, useEffect } from 'react';
import '../Dashboard/Dashboard.css';

const CurrencyConverter = () => {
    // State for two-way binding
    const [amount1, setAmount1] = useState('1');
    const [currency1, setCurrency1] = useState('USD');
    const [amount2, setAmount2] = useState('');
    const [currency2, setCurrency2] = useState('INR');

    const [rates, setRates] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch rates when currency1 changes
    useEffect(() => {
        const fetchRates = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Using a free, no-key-required API for demo purposes
                const response = await fetch(`https://open.er-api.com/v6/latest/${currency1}`);
                if (!response.ok) throw new Error('Failed to fetch rates');
                const data = await response.json();
                setRates(data.rates);

                // Update amount2 based on new rates
                if (data.rates[currency2]) {
                    setAmount2((Number(amount1) * data.rates[currency2]).toFixed(2));
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load rates');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRates();
    }, [currency1]); // Dependency on currency1 to re-fetch base rates

    // Recalculate when amount1 changes
    const handleAmount1Change = (val) => {
        setAmount1(val);
        if (rates[currency2]) {
            setAmount2((Number(val) * rates[currency2]).toFixed(2));
        }
    };

    // Recalculate when amount2 changes (Reverse calculation)
    const handleAmount2Change = (val) => {
        setAmount2(val);
        if (rates[currency2]) {
            setAmount1((Number(val) / rates[currency2]).toFixed(2));
        }
    };

    // Recalculate when currency2 changes
    const handleCurrency2Change = (newCurrency) => {
        setCurrency2(newCurrency);
        if (rates[newCurrency]) {
            setAmount2((Number(amount1) * rates[newCurrency]).toFixed(2));
        }
    };

    const handleSwap = () => {
        const tempCurr = currency1;
        setCurrency1(currency2);
        setCurrency2(tempCurr);
        // Effects will trigger re-fetch and re-calculation
    };

    // Common Currencies
    const currencies = ["USD", "EUR", "GBP", "JPY", "INR", "AUD", "CAD", "CHF", "CNY", "SGD"];

    return (
        <div className="card currency-converter-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, color: '#1f2937', fontSize: '1.125rem' }}>Quick Convert</h3>
                {isLoading && <span style={{ fontSize: '0.8rem', color: '#8B5CF6' }}>Updating...</span>}
            </div>

            {error ? (
                <div style={{ color: '#ef4444', fontSize: '0.9rem', marginBottom: '10px' }}>{error}</div>
            ) : (
                <div className="converter-container" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                    {/* Row 1 */}
                    <div className="input-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="number"
                                value={amount1}
                                onChange={(e) => handleAmount1Change(e.target.value)}
                                className="amount-input"
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    background: '#f9fafb',
                                    color: '#1f2937', /* Dark Text */
                                    fontSize: '1rem',
                                    outline: 'none',
                                    fontWeight: '500'
                                }}
                            />
                        </div>
                        <select
                            value={currency1}
                            onChange={(e) => setCurrency1(e.target.value)}
                            className="currency-select"
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: 'white',
                                color: '#1f2937', /* Dark Text */
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {currencies.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                        </select>
                    </div>

                    {/* Swap Actions */}
                    <div className="swap-container" style={{ display: 'flex', justifyContent: 'center', margin: '-8px 0', zIndex: 10 }}>
                        <button
                            onClick={handleSwap}
                            title="Swap Currencies"
                            style={{
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#8B5CF6',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}
                        >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                        </button>
                    </div>

                    {/* Row 2 */}
                    <div className="input-group" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="number"
                                value={amount2}
                                onChange={(e) => handleAmount2Change(e.target.value)}
                                className="amount-input"
                                placeholder="0.00"
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    background: '#f9fafb',
                                    color: '#1f2937', /* Dark Text */
                                    fontSize: '1rem',
                                    outline: 'none',
                                    fontWeight: '500'
                                }}
                            />
                        </div>
                        <select
                            value={currency2}
                            onChange={(e) => handleCurrency2Change(e.target.value)}
                            className="currency-select"
                            style={{
                                padding: '10px',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: 'white',
                                color: '#1f2937', /* Dark Text */
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {currencies.map(curr => <option key={curr} value={curr}>{curr}</option>)}
                        </select>
                    </div>

                    {/* Live Rate Info */}
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
                        1 {currency1} ≈ {rates[currency2] ? rates[currency2].toFixed(4) : '...'} {currency2}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencyConverter;
