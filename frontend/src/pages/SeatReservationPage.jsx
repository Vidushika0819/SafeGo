import React, { useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import SeatMap from "../components/SeatMap";
import { getAllRoutes, getBusesByRoute } from "../services/api";

const SeatReservationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const studentType = searchParams.get("type") || "Student";
  const studentID = searchParams.get("studentID") || "STUDENT001"; // Get studentID from URL or default
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busesLoading, setBusesLoading] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [availableBuses, setAvailableBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  // Fetch routes from backend on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        setLoading(true);
        const result = await getAllRoutes();
        setRoutes(result.routes || []);
      } catch (error) {
        console.error("Failed to fetch routes:", error);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutes();
  }, []);

  // Handle route selection → fetch buses for selected route
  const handleRouteChange = async (e) => {
    const routeID = e.target.value;
    setSelectedRoute(routeID);
    setSelectedBus(null); // reset bus when route changes
    
    // Store route ID in sessionStorage for waitlist form
    if (routeID) {
      sessionStorage.setItem('selectedRouteID', routeID);
    } else {
      sessionStorage.removeItem('selectedRouteID');
    }
    
    if (!routeID) {
      setAvailableBuses([]);
      return;
    }

    try {
      setBusesLoading(true);
      const result = await getBusesByRoute(routeID);
      setAvailableBuses(result.buses || []);
    } catch (error) {
      console.error("Failed to fetch buses for route:", error);
      setAvailableBuses([]);
      // You could show a toast/alert here if needed
    } finally {
      setBusesLoading(false);
    }
  };

  // Handle return from payment success - restore previous bus selection
  useEffect(() => {
    const stateData = location.state;
    if (stateData) {
      // Show message if available (could be implemented with toast notifications)
      if (stateData.message) {
        // Future: Show toast notification for return messages
      }
      
      // Restore bus selection if returning from payment
      if (stateData.returnToBus && stateData.selectedBusInfo) {
        const busInfo = stateData.selectedBusInfo;
        
        // Set the route first
        setSelectedRoute(busInfo.routeId);
        // Fetch buses for that route
        getBusesByRoute(busInfo.routeId).then(result => {
          const fetchedBuses = result.buses || [];
          setAvailableBuses(fetchedBuses);
          
          // Find and set the selected bus
          const foundBus = fetchedBuses.find(b => b.busID === busInfo.busID);
          if (foundBus) {
            setSelectedBus(foundBus);
          }
        }).catch(error => {
          console.error("Failed to restore bus selection:", error);
        });
      }
    }
  }, [location.state]);



  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px 16px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "15px"
          }}
        >
          ← Back to Dashboard
        </button>
        <h1 style={{ margin: 0 }}>Seat Reservation ({studentType} Student - {studentID})</h1>
      </div>



      {/* Step 1: Select Route */}
      <div>
        <label>Select Route: </label>
        <select value={selectedRoute} onChange={handleRouteChange} disabled={loading}>
          <option value="">
            {loading ? "Loading routes..." : "-- Choose a Route --"}
          </option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        {routes.length === 0 && !loading && (
          <p style={{ color: "#dc3545", fontSize: "14px", marginTop: "5px" }}>
            ⚠️ No routes available. Please contact admin to add routes.
          </p>
        )}
      </div>

      {/* Step 2: Show Buses */}
      {selectedRoute && (
        <div style={{ marginTop: "20px" }}>
          <h3>Available Buses for {routes.find(r => r.id === selectedRoute)?.name}:</h3>
          {busesLoading ? (
            <p>Loading buses...</p>
          ) : availableBuses.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px", marginTop: "15px" }}>
              {availableBuses.map((bus) => (
                <div
                  key={bus.busID}
                  onClick={() => setSelectedBus(bus)}
                  style={{
                    padding: "15px",
                    border: "2px solid #007bff",
                    borderRadius: "8px",
                    cursor: "pointer",
                    backgroundColor: selectedBus?.busID === bus.busID ? "#007bff" : "white",
                    color: selectedBus?.busID === bus.busID ? "white" : "#333",
                    transition: "all 0.3s",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBus?.busID !== bus.busID) {
                      e.target.style.backgroundColor = "#f8f9fa";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBus?.busID !== bus.busID) {
                      e.target.style.backgroundColor = "white";
                    }
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>
                    🚌 {bus.busNumber}
                  </h4>
                  <p style={{ margin: "0 0 5px 0", fontSize: "14px", opacity: 0.8 }}>
                    ID: {bus.busID}
                  </p>
                  <p style={{ margin: "0 0 5px 0", fontSize: "14px", opacity: 0.8 }}>
                    Driver: {bus.driverName}
                  </p>
                  <p style={{ margin: 0, fontSize: "14px", opacity: 0.8 }}>
                    Seats: {bus.totalSeats}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              backgroundColor: "#fff3cd", 
              border: "1px solid #ffeaa7",
              padding: "15px", 
              borderRadius: "5px",
              marginTop: "15px"
            }}>
              <p style={{ margin: 0, color: "#856404" }}>
                ⚠️ No buses available for this route. Please contact the school admin to add buses to this route.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Seat Map */}
      {selectedBus && (
        <div style={{ marginTop: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
            <button
              onClick={() => {
                setSelectedBus(null);
                setSelectedRoute("");
                setAvailableBuses([]);
              }}
              style={{
                padding: "8px 16px",
                backgroundColor: "#6c757d",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "15px"
              }}
            >
              ← Back to Route Selection
            </button>
            <h3 style={{ margin: 0 }}>Seat Map for {selectedBus.busNumber} ({selectedBus.busID})</h3>
          </div>
          
          <div style={{ 
            backgroundColor: "#fff3cd", 
            border: "1px solid #ffeaa7",
            padding: "15px", 
            borderRadius: "5px",
            marginBottom: "20px"
          }}>
            <p style={{ margin: 0, fontSize: "14px", color: "#856404" }}>
              ℹ️ If no seats are visible, please contact the school admin to generate seats for this bus.
            </p>
          </div>
          <SeatMap busID={selectedBus.busID} studentID={studentID} />
        </div>
      )}
    </div>
  );
};

export default SeatReservationPage;
