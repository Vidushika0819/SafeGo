import React, { useState } from "react";

const SeatMap = () => {
  // sample seats (later will come from backend)
  const [seats, setSeats] = useState([
    { seatNumber: 1, status: "Available" },
    { seatNumber: 2, status: "Booked" },
    { seatNumber: 3, status: "Pending" },
    { seatNumber: 4, status: "Available" },
    // ... add until 28 seats
  ]);

  const handleClick = (seat) => {
    if (seat.status !== "Available") {
      alert("Seat not available!");
      return;
    }
    alert(`You selected seat ${seat.seatNumber}`);
  };

  return (
    <div>
      <h2>Bus Seat Map</h2>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 60px)",
        gap: "10px",
        marginTop: "20px"
      }}>
        {seats.map((seat) => (
          <button
            key={seat.seatNumber}
            onClick={() => handleClick(seat)}
            style={{
              padding: "15px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              backgroundColor:
                seat.status === "Available"
                  ? "green"
                  : seat.status === "Booked"
                  ? "red"
                  : "orange",
              color: "white",
              cursor: seat.status === "Available" ? "pointer" : "not-allowed"
            }}
          >
            {seat.seatNumber}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SeatMap;
