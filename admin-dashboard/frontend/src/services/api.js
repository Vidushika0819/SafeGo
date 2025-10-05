const BASE_URL = "http://localhost:5000";

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

// Waitlist API functions
export async function addToWaitlist({ studentID, busID, routeID, studentType, expectedDuration, seasonType, requestedDate }) {
  const res = await fetch(`${BASE_URL}/api/waitlist/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      studentID, 
      busID, 
      routeID, 
      studentType, 
      expectedDuration, 
      seasonType, 
      requestedDate 
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || err?.error || "Failed to add to waitlist");
  }
  return await res.json();
}

export async function getWaitlistByBus(busID) {
  const res = await fetch(`${BASE_URL}/api/waitlist/bus/${encodeURIComponent(busID)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch waitlist");
  }
  return await res.json();
}

export async function getAllWaitlists() {
  const res = await fetch(`${BASE_URL}/api/waitlist/admin/all`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || "Failed to fetch waitlists");
  }
  return await res.json();
}

export async function cancelWaitlistEntry(waitlistID) {
  const res = await fetch(`${BASE_URL}/api/waitlist/${encodeURIComponent(waitlistID)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || err?.error || "Failed to cancel waitlist entry");
  }
  return await res.json();
}


