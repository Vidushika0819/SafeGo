import React, { useState } from "react";

const SeatMap = ({ busID, studentID }) => {
  // Initialize 28 seats with sample status (later fetch from backend)
  const [seats, setSeats] = useState(
    Array.from({ length: 28 }, (_, i) => ({
      seatNumber: i + 1,
      status: "Available", // Available | Booked | Pending
    }))
  );

  // Handle seat click
  const handleClick = (seatIndex) => {
    const seat = seats[seatIndex];

    if (seat.status !== "Available") {
      alert(`Seat ${seat.seatNumber} is not available`);
      return;
    }

    // For now: just update status locally (later call backend)
    const updatedSeats = [...seats];
    updatedSeats[seatIndex].status = "Pending";

    setSeats(updatedSeats);

    alert(
      `Seat ${seat.seatNumber} selected by student ${studentID} on bus ${busID}`
    );
  };

  return (
    <div>
      <div style={{ marginBottom: "15px" }}>
        <span
          style={{ background: "green", padding: "5px", marginRight: "10px" }}
        >
          Available
        </span>
        <span
          style={{ background: "red", padding: "5px", marginRight: "10px" }}
        >
          Booked
        </span>
        <span style={{ background: "orange", padding: "5px" }}>Pending</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 60px)",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        {seats.map((seat, index) => (
          <button
            key={seat.seatNumber}
            onClick={() => handleClick(index)}
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
              fontWeight: "bold",
              cursor: seat.status === "Available" ? "pointer" : "not-allowed",
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
