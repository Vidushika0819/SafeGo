const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function getSeatsByBus(busID) {
  const res = await fetch(`${BASE_URL}/api/seats/bus/${encodeURIComponent(busID)}`);
  if (!res.ok) throw new Error("Failed to load seats");
  return await res.json();
}

export async function createReservation({ studentID, busID, seatNumber, reservationType, startDate, endDate, daysBooked, seasonType }) {
  const res = await fetch(`${BASE_URL}/api/reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      studentID, 
      busID, 
      seatNumber, 
      reservationType, 
      startDate, 
      endDate, 
      daysBooked, 
      seasonType 
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || err?.error || "Failed to create reservation");
  }
  return await res.json();
}

export async function generateSeatsForBus({ busID, totalSeats = 28 }) {
  const res = await fetch(`${BASE_URL}/api/seats/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ busID, totalSeats }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || err?.message || "Failed to generate seats");
  }
  return await res.json();
}

// Fetch all routes from backend
export async function getAllRoutes() {
  const res = await fetch(`${BASE_URL}/api/routes`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch routes");
  }
  return await res.json();
}

// Fetch all buses from backend
export async function getAllBuses() {
  const res = await fetch(`${BASE_URL}/api/buses`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch buses");
  }
  return await res.json();
}

// Fetch buses by route from backend
export async function getBusesByRoute(routeId) {
  const res = await fetch(`${BASE_URL}/api/buses/route/${encodeURIComponent(routeId)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch buses for route");
  }
  return await res.json();
}

// Waitlist functions
export async function checkSeatAvailability(busID) {
  const res = await fetch(`${BASE_URL}/api/waitlist/check-availability/${encodeURIComponent(busID)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to check seat availability");
  }
  return await res.json();
}

export async function joinWaitlist(waitlistData) {
  const res = await fetch(`${BASE_URL}/api/waitlist/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(waitlistData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || err?.error || "Failed to join waitlist");
  }
  return await res.json();
}

export async function getStudentWaitlist(studentID) {
  const res = await fetch(`${BASE_URL}/api/waitlist/student/${encodeURIComponent(studentID)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch waitlist entries");
  }
  return await res.json();
}

export async function cancelWaitlistEntry(waitlistID, studentID) {
  const res = await fetch(`${BASE_URL}/api/waitlist/${encodeURIComponent(waitlistID)}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ studentID }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || err?.error || "Failed to cancel waitlist entry");
  }
  return await res.json();
}


