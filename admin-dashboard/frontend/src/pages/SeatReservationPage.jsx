import React, { useState, useEffect } from "react";
import SeatMap from "../components/SeatMap";
import { fetchSeats } from "../services/api";

// Dummy routes & buses (later load from backend)
const routes = [
  { id: "R1", name: "Route A - City Center" },
  { id: "R2", name: "Route B - Suburb" },
  { id: "R3", name: "Route C - North Town" },
];

const buses = [
  { id: "SGB001", route: "R1", name: "Bus 001" },
  { id: "SGB002", route: "R1", name: "Bus 002" },
  { id: "SGB003", route: "R2", name: "Bus 003" },
  { id: "SGB004", route: "R3", name: "Bus 004" },
];

const SeatReservationPage = () => {
  const [selectedRoute, setSelectedRoute] = useState("");
  const [availableBuses, setAvailableBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);

  // Handle route selection → filter buses
  const handleRouteChange = (e) => {
    const routeID = e.target.value;
    setSelectedRoute(routeID);
    setAvailableBuses(buses.filter((b) => b.route === routeID));
    setSelectedBus(null); // reset bus when route changes
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Bus Seat Reservation</h1>

      {/* Step 1: Select Route */}
      <div>
        <label>Select Route: </label>
        <select value={selectedRoute} onChange={handleRouteChange}>
          <option value="">-- Choose a Route --</option>
          {routes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </div>

      {/* Step 2: Show Buses */}
      {selectedRoute && (
        <div style={{ marginTop: "20px" }}>
          <h3>Available Buses for {routes.find(r => r.id === selectedRoute)?.name}:</h3>
          {availableBuses.length > 0 ? (
            availableBuses.map((bus) => (
              <button
                key={bus.id}
                onClick={() => setSelectedBus(bus)}
                style={{ margin: "5px", padding: "10px" }}
              >
                {bus.name}
              </button>
            ))
          ) : (
            <p>No buses available for this route.</p>
          )}
        </div>
      )}

      {/* Step 3: Seat Map */}
      {selectedBus && (
        <div style={{ marginTop: "30px" }}>
          <h3>Seat Map for {selectedBus.name}</h3>
          <SeatMap busID={selectedBus.id} studentID="STU001" />
        </div>
      )}
    </div>
  );
};

export default SeatReservationPage;
