
import React from 'react';

const Analytics = ({ allTrips, onSwitchTrip, onBack }) => {

    const ongoingTrips = allTrips.filter(trip => trip.status !== 'completed');
    const completedTrips = allTrips.filter(trip => trip.status === 'completed');

    const TripCard = ({ trip }) => (
        <div
            onClick={() => onSwitchTrip(trip)}
            style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                border: '1px solid #f3f4f6',
                transition: 'all 0.2s',
                position: 'relative'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)' }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <div style={{ fontSize: '2rem', background: '#f3f4f6', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>✈️</div>
                {trip.status === 'completed' ? (
                    <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', height: 'fit-content' }}>Completed</span>
                ) : (
                    <span style={{ background: '#ede9fe', color: '#7c3aed', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', height: 'fit-content' }}>Active</span>
                )}
            </div>
            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>{trip.location}</h3>
            <p style={{ margin: '0 0 15px 0', color: '#6b7280', fontSize: '0.9rem' }}>Created: {trip.createdAt?.toDate ? trip.createdAt.toDate().toLocaleDateString() : 'Unknown'}</p>

            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#4b5563' }}>
                <span>💰 Budget: <strong>₹{trip.budget}</strong></span>
            </div>
        </div>
    );

    return (
        <div className="analytics-view" style={{ padding: '20px' }}>
            {onBack && (
                <div style={{ marginBottom: '20px' }}>
                    <button onClick={onBack} style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        background: 'white', border: '1px solid #e5e7eb',
                        padding: '8px 16px', borderRadius: '8px',
                        color: '#4b5563', fontWeight: '500', cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                        onMouseEnter={(e) => e.target.style.background = '#f9fafb'}
                        onMouseLeave={(e) => e.target.style.background = 'white'}
                    >
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Back to Dashboard
                    </button>
                </div>
            )}
            <header className="top-header" style={{ marginBottom: '30px' }}>
                <div>
                    <h1>Your Travel History</h1>
                    <p className="date-text">Track your past adventures and ongoing journeys.</p>
                </div>
            </header>

            {ongoingTrips.length > 0 && (
                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '15px', borderBottom: '2px solid #ede9fe', paddingBottom: '5px', display: 'inline-block' }}>Ongoing Trips</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {ongoingTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
                    </div>
                </div>
            )}

            {completedTrips.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '1.2rem', color: '#4b5563', marginBottom: '15px', borderBottom: '2px solid #d1fae5', paddingBottom: '5px', display: 'inline-block' }}>Past Adventures</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                        {completedTrips.map(trip => <TripCard key={trip.id} trip={trip} />)}
                    </div>
                </div>
            )}

            {allTrips.length === 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh', color: '#9ca3af' }}>
                    <p>No trips found yet.</p>
                </div>
            )}
        </div>
    );
};

export default Analytics;
