const Route = require("../Model/RouteModel");

// Create a new route
exports.createRoute = async (req, res) => {
  try {
    console.log("Create route request received:");
    console.log("Request body:", req.body);
    console.log("Admin info:", req.admin ? { id: req.admin._id, username: req.admin.username } : "No admin info");
    
    const { id, name, description, stops } = req.body;
    
    if (!req.admin) {
      console.error("No admin in request object");
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const adminUsername = req.admin.username; // From auth middleware

    // Check if route ID already exists
    const existingRoute = await Route.findOne({ id });
    if (existingRoute) {
      console.log("Route ID already exists:", id);
      return res.status(400).json({ error: "Route ID already exists" });
    }

    // Validate stops
    if (!stops || !Array.isArray(stops) || stops.length === 0) {
      console.log("Invalid stops data:", stops);
      return res.status(400).json({ error: "At least one stop is required" });
    }

    // Create new route
    const newRoute = new Route({
      id,
      name,
      description,
      stops,
      createdBy: adminUsername
    });

    await newRoute.save();
    console.log("Route created successfully:", newRoute._id);

    res.status(201).json({
      message: "Route created successfully",
      route: newRoute
    });
  } catch (error) {
    console.error("Error creating route:", error);
    res.status(500).json({ error: "Failed to create route" });
  }
};

// Get all routes
exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ routes });
  } catch (error) {
    console.error("Error fetching routes:", error);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
};

// Get route by ID
exports.getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const route = await Route.findOne({ id, isActive: true });
    
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    res.json({ route });
  } catch (error) {
    console.error("Error fetching route:", error);
    res.status(500).json({ error: "Failed to fetch route" });
  }
};

// Update route
exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, stops, isActive } = req.body;

    const route = await Route.findOne({ id });
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    // Update fields
    if (name) route.name = name;
    if (description !== undefined) route.description = description;
    if (stops) route.stops = stops;
    if (isActive !== undefined) route.isActive = isActive;

    await route.save();

    res.json({
      message: "Route updated successfully",
      route
    });
  } catch (error) {
    console.error("Error updating route:", error);
    res.status(500).json({ error: "Failed to update route" });
  }
};

// Delete route (soft delete)
exports.deleteRoute = async (req, res) => {
  try {
    const { id } = req.params;

    const route = await Route.findOne({ id });
    if (!route) {
      return res.status(404).json({ error: "Route not found" });
    }

    route.isActive = false;
    await route.save();

    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    console.error("Error deleting route:", error);
    res.status(500).json({ error: "Failed to delete route" });
  }
};