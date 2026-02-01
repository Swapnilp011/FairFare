// Delete Trip Handler
const handleDeleteTrip = async (e, tripId) => {
    e.stopPropagation(); // Prevent switching to the trip we are deleting

    if (!window.confirm("Are you sure you want to permanently delete this trip?")) {
        return;
    }

    try {
        // 1. Delete from Firestore
        if (!tripId.toString().startsWith('local_')) {
            await deleteDoc(doc(db, "trips", tripId));
        }

        // 2. Remove from Local Storage (if current)
        const localTripJson = localStorage.getItem('currentTrip');
        if (localTripJson) {
            const localTrip = JSON.parse(localTripJson);
            if (localTrip.id == tripId) {
                localStorage.removeItem('currentTrip');
            }
        }

        // 3. Update State
        const updatedTrips = allTrips.filter(t => t.id !== tripId);
        setAllTrips(updatedTrips);

        // 4. If we deleted the ACTIVE trip, switch to another one or clear state
        if (tripId == currentTripId) {
            if (updatedTrips.length > 0) {
                handleSwitchTrip(updatedTrips[0]);
            } else {
                // No trips left - Reset validation state
                setTotalBudget(5000);
                setCurrentSpend(0);
                setTripPlan(null);
                setCity('');
                setExpenses([]);
                setCurrentTripId(null);
                setDashboardView('overview');
            }
        }
    } catch (error) {
        console.error("Error deleting trip:", error);
        alert("Failed to delete trip.");
    }
};
