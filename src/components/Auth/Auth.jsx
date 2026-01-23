import React, { useState } from 'react';
import './Auth.css';
import { auth, db } from '../../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        country: '',
        state: '',
        city: '',
        gender: 'select'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login Logic
                const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
                console.log("Logged in:", userCredential.user);
                onLogin(userCredential.user);
            } else {
                // Signup Logic
                if (formData.gender === 'select') {
                    throw new Error("Please select a gender");
                }

                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const user = userCredential.user;

                // Update Profile Name
                await updateProfile(user, {
                    displayName: formData.name
                });

                // Save extra details to Firestore
                await setDoc(doc(db, "users", user.uid), {
                    name: formData.name,
                    email: formData.email,
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                    gender: formData.gender,
                    uid: user.uid,
                    createdAt: new Date()
                });

                console.log("Registered:", user);
                onLogin(user);
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="logo-small">✈️ FairFare</div>
                    <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p>{isLogin ? 'Login to continue your journey' : 'Join us and travel smarter'}</p>
                </div>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">

                    {!isLogin && (
                        <>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        placeholder="India"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        placeholder="Maharashtra"
                                        value={formData.state}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="Mumbai"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                                        <option value="select" disabled>Select</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span onClick={() => setIsLogin(!isLogin)} className="auth-toggle">
                            {isLogin ? 'Sign Up' : 'Login'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Auth;
