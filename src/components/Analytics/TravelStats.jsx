import React from 'react';

const TravelStats = ({ allTrips = [] }) => {
    if (!allTrips) return null;

    // Logic for unique places
    const uniquePlacesCount = new Set(allTrips.map(t => t.location?.trim().toLowerCase()).filter(Boolean)).size;
    const totalTripsCount = allTrips.length;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
        }}>
            {/* Total Trips Card */}
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ background: '#eff6ff', padding: '8px', borderRadius: '10px', color: '#3b82f6' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.806-.98l-4.286-1.428" /></svg>
                    </div>
                    <h4 style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontWeight: '600' }}>Total Trips</h4>
                </div>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#1f2937' }}>{totalTripsCount}</p>
            </div>

            {/* Unique Places Card */}
            <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div style={{ background: '#f5f3ff', padding: '8px', borderRadius: '10px', color: '#8b5cf6' }}>
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <h4 style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', fontWeight: '600' }}>Unique Places</h4>
                </div>
                <p style={{ margin: 0, fontSize: '2rem', fontWeight: '700', color: '#8B5CF6' }}>
                    {uniquePlacesCount}
                </p>
            </div>
        </div>
    );
};

export default TravelStats;
