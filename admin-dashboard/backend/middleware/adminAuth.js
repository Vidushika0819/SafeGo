const jwt = require("jsonwebtoken");
const Admin = require("../Model/AdminModel");

const JWT_SECRET = process.env.JWT_SECRET || "safego-admin-secret-key-2025";

// Verify JWT token
const authenticateAdmin = async (req, res, next) => {
  try {
    console.log("Auth middleware - Headers:", req.headers.authorization);
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.log("Auth middleware - No token provided");
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    console.log("Auth middleware - Token found, verifying...");
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Auth middleware - Token decoded:", { adminId: decoded.adminId, role: decoded.role });
    
    // Check if admin still exists and is active
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      console.log("Auth middleware - Admin not found or inactive");
      return res.status(401).json({ error: "Invalid token or admin deactivated." });
    }

    console.log("Auth middleware - Admin authenticated:", admin.username);
    req.adminId = decoded.adminId;
    req.adminRole = decoded.role;
    req.admin = admin; // Add the full admin object for easy access
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).json({ error: "Invalid token." });
  }
};

// Check if admin is super-admin
const requireSuperAdmin = (req, res, next) => {
  if (req.adminRole !== "super-admin") {
    return res.status(403).json({ error: "Access denied. Super admin role required." });
  }
  next();
};

module.exports = {
  authenticateAdmin,
  requireSuperAdmin
};