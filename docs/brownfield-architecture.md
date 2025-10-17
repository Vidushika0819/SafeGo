# SafeGo Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the SafeGo bus management system codebase, including technical debt, workarounds, and real-world patterns. It serves as a reference for AI agents working on enhancements.

### Document Scope

Focused on areas relevant to: Complete the system with authentication, role-based access, improved UI, and security fixes. Transform the current basic CRUD system into a complete, working bus management prototype.

### Change Log

| Date   | Version | Description                 | Author    |
| ------ | ------- | --------------------------- | --------- |
| 10/10/2025 | 2.0     | Updated with current authentication implementation | Analyst   |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry (Backend)**: `backend/app.js` - Express server setup and route configuration
- **Configuration**: `backend/.env` - Environment variables (MongoDB URI, JWT_SECRET)
- **Core Business Logic**: `backend/Controllers/` - HTTP request handlers for all entities
- **API Definitions**: `backend/Routes/` - Route definitions for auth, trips, buses, drivers, coordinators
- **Database Models**: `backend/Models/` - Mongoose schemas for all entities
- **Frontend Entry**: `frontend/src/index.js` - React app entry point
- **Main App Component**: `frontend/src/App.js` - React router setup
- **Key Components**: `frontend/src/components/` - UI components for each entity including Auth

### If PRD Provided - Enhancement Impact Areas

Based on the enhancement requirements, these files will be affected:

- `backend/Models/User.js` - Already updated with authentication
- `backend/Controllers/authController.js` - Authentication logic implemented
- `backend/Routes/authRoutes.js` - Auth endpoints added
- `frontend/src/components/Auth/` - Authentication UI components (partially implemented)
- All controller files for role-based authorization middleware
- All frontend components for role-based rendering
- Dashboard components for admin, coordinator, driver roles

## High Level Architecture

### Technical Summary

SafeGo is a full-stack web application for managing bus operations, including trips, buses, drivers, coordinators, parents, and children. The backend provides REST APIs using Node.js and Express, with MongoDB as the database. Authentication is implemented using JWT tokens and bcrypt password hashing. The frontend is a React single-page application that consumes these APIs.

### Actual Tech Stack (from package.json)

| Category  | Technology | Version | Notes                      |
| --------- | ---------- | ------- | -------------------------- |
| Runtime   | Node.js    | -       | Backend runtime            |
| Framework | Express    | 5.1.0   | Backend web framework      |
| Database  | MongoDB    | -       | NoSQL database with Mongoose ODM |
| ODM       | Mongoose   | 8.18.0  | MongoDB object modeling    |
| Auth      | bcrypt     | 5.1.0   | Password hashing           |
| Auth      | jsonwebtoken| 9.0.0   | JWT token generation       |
| Frontend  | React      | 19.1.1  | UI framework               |
| Routing   | React Router | 7.9.3 | Client-side routing        |
| HTTP Client| Axios     | 1.11.0  | API communication         |
| Middleware| CORS       | 2.8.5   | Cross-origin requests      |
| Dev Tool  | Nodemon    | 3.1.10  | Backend development server |
| Testing   | Jest       | 29.7.0  | Testing framework         |

### Repository Structure Reality Check

- Type: Monorepo (backend/ and frontend/ in same repository)
- Package Manager: npm
- Notable: Separate package.json files, authentication partially implemented, role-based access not yet enforced

## Source Tree and Module Organization

### Project Structure (Actual)

```
SafeGo/
├── backend/
│   ├── Controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── BusControllers.js
│   │   ├── childController.js
│   │   ├── CoordinatorControllers.js
│   │   ├── DriverControllers.js
│   │   ├── messageController.js
│   │   ├── ParentControllers.js
│   │   ├── tripAssignmentController.js
│   │   └── TripController.js
│   ├── Models/
│   │   ├── BusModel.js
│   │   ├── Child.js
│   │   ├── CoordinatorModel.js
│   │   ├── DriverModel.js
│   │   ├── Message.js
│   │   ├── ParentModel.js
│   │   ├── TripAssignment.js
│   │   ├── TripModel.js
│   │   └── User.js
│   ├── Routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── BusRoutes.js
│   │   ├── childRoutes.js
│   │   ├── CoordinatorRoutes.js
│   │   ├── DriverRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── ParentRoutes.js
│   │   ├── tripAssignmentRoutes.js
│   │   └── TripRoutes.js
│   ├── app.js
│   ├── package.json
│   ├── seedUsers.js
│   └── .env (not committed)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   ├── Bus/
│   │   │   ├── Coordinator/
│   │   │   ├── Driver/
│   │   │   ├── Home/
│   │   │   ├── Nav/
│   │   │   ├── Operational/
│   │   │   ├── Parent/
│   │   │   └── Trip/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   └── reportWebVitals.js
│   ├── package.json
│   ├── public/
│   └── README.md
└── docs/
    ├── prd.md
    ├── brownfield-architecture.md
    └── qa/
```

### Key Modules and Their Purpose

- **Authentication**: `backend/Controllers/authController.js` - User registration, login, JWT token management
- **User Management**: `backend/Models/User.js` - User accounts with role-based profiles
- **Trip Management**: `backend/Controllers/TripController.js` - Trip CRUD with population of related entities
- **Admin Functions**: `backend/Controllers/adminController.js` - Administrative operations
- **Auth Context**: `frontend/src/context/AuthContext.js` - React context for authentication state
- **Auth Components**: `frontend/src/components/Auth/` - Login/register UI components

## Data Models and APIs

### Data Models

#### User Model (User.js)
- **email**: String, required, unique, lowercase - User email
- **password**: String, required - Hashed password (bcrypt)
- **role**: String, enum ['admin', 'coordinator', 'driver', 'parent'], required
- **profile**: ObjectId ref to role-specific model - Profile reference
- **timestamps**: createdAt, updatedAt

#### Trip Model (TripModel.js)
- **Trip_ID**: String, required, unique - Primary identifier
- **date**: Date, required - Trip date
- **start_time**: String, required - Trip start time
- **end_time**: String, required - Trip end time
- **start_location**: String, required - Starting point
- **route**: String, required - Trip route description
- **status**: String, enum ["scheduled", "ongoing", "completed", "canceled"], required
- **busId**: ObjectId ref "Bus", required - Assigned bus
- **driverId**: ObjectId ref "Driver", required - Assigned driver
- **coordinatorId**: ObjectId ref "Coordinator", required - Assigned coordinator

#### Other Models
- **Bus**: busId, busNumber, busType, capacity, status
- **Driver**: name, licenseNumber, phoneNumber, vehicleType, vehicleNumber, age, experienceYears, email, address, password (NOTE: still plain text)
- **Coordinator**: coordinatorId, fullName, phoneNumber, DOB, email, address, password (NOTE: still plain text)
- **Parent**: parentId, fullName, phoneNumber, DOB, email, address, password (NOTE: still plain text)
- **Child**: childId, fullName, DOB, grade, allergies, emergencyContact, parentId
- **TripAssignment**: tripId, childId, status, notes
- **Message**: senderId, receiverId, message, timestamp

### API Specifications

- **Base URL**: http://localhost:5005
- **Auth Routes** (`/api/auth`):
  - POST /register - User registration
  - POST /login - User login
  - POST /logout - User logout
  - GET /profile - Get user profile
  - POST /register-parent - Parent-specific registration
  - POST /login-parent - Parent-specific login

- **Other Routes**:
  - `/api/admin` - Admin operations
  - `/api/children` - Child management
  - `/api/trip-assignments` - Trip assignments
  - `/api/messages` - Messaging
  - `/trips` - Trip management
  - `/drivers` - Driver management
  - `/coordinators` - Coordinator management
  - `/buses` - Bus management
  - `/parents` - Parent management

- **Response Format**: JSON with success/message structure
- **Authentication**: JWT tokens required for protected routes (not yet enforced)

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Inconsistent Password Storage**: User model uses bcrypt, but Driver/Coordinator/Parent models still use plain text
2. **No Authorization Middleware**: Authentication exists but no role-based access control on routes
3. **Mixed Authentication**: Separate auth for parents vs other roles, inconsistent API
4. **Frontend Auth Incomplete**: Auth components exist but no protected routes or role-based UI
5. **Environment Variables**: JWT_SECRET has default fallback, .env not committed
6. **Testing**: Jest configured but no actual tests written
7. **State Management**: No global state management, direct API calls in components
8. **Error Handling**: Inconsistent error responses across controllers

### Workarounds and Gotchas

- **Role-Specific Auth**: Parents use different login/register endpoints
- **Profile References**: User model references role-specific profiles but population not always used
- **JWT Expiration**: 24h default, 7d for rememberMe parents
- **Password Validation**: Strong validation on registration but no frontend feedback
- **Seed Users**: Sample users created on startup for testing

## Integration Points and External Dependencies

### External Services

| Service  | Purpose  | Integration Type | Key Files                      |
| -------- | -------- | ---------------- | ------------------------------ |
| MongoDB  | Database | Mongoose ODM     | All Model files                |

### Internal Integration Points

- **API Communication**: Frontend uses Axios, assumes localhost:5005
- **Authentication Flow**: JWT tokens stored client-side, no refresh mechanism
- **Role-Based Profiles**: User model links to role-specific profile models
- **Data Relationships**: Trips populate bus/driver/coordinator, assignments link children to trips

## Development and Deployment

### Local Development Setup

1. **Backend Setup**:
   - cd backend
   - npm install
   - Create .env with MONGODB_URI and JWT_SECRET
   - npm run dev (port 5005)

2. **Frontend Setup**:
   - cd frontend
   - npm install
   - npm start (port 3000)

3. **Database**: MongoDB required, seeded users on startup

### Build and Deployment Process

- **Backend**: No build, direct node execution
- **Frontend**: npm run build for production
- **Testing**: npm test (Jest, no tests written)

## Testing Reality

### Current Test Coverage

- Unit Tests: None
- Integration Tests: None
- E2E Tests: None
- Manual Testing: Primary method

## If Enhancement PRD Provided - Impact Analysis

### Files That Will Need Modification

Based on the enhancement requirements, these files will be affected:

- `backend/Models/Driver.js`, `CoordinatorModel.js`, `ParentModel.js` - Migrate to hashed passwords
- `backend/Controllers/` - Add authorization middleware to all controllers
- `backend/Routes/` - Apply auth middleware to protected routes
- `frontend/src/App.js` - Add protected routes and role-based rendering
- `frontend/src/components/` - Update all components for role-based access
- `frontend/src/context/AuthContext.js` - Expand for role management
- Dashboard components for each role (admin, coordinator, driver)

### New Files/Modules Needed

- Authorization middleware (`backend/middleware/auth.js`)
- Role-based dashboard components
- Password migration script
- Protected route component
- API service layer for consistent error handling

### Integration Considerations

- Authorization middleware must be applied consistently
- Frontend must handle role-based UI rendering
- Password migration must preserve existing accounts
- Session management across role-specific interfaces
- Error handling for unauthorized access attempts

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
# Backend
cd backend
npm install
npm run dev
npm run seed

# Frontend
cd frontend
npm install
npm start
npm run build
npm test
```

### Debugging and Troubleshooting

- **Auth Issues**: Check JWT_SECRET in .env
- **CORS Errors**: Ensure backend CORS allows frontend origin
- **Password Hashing**: User model uses bcrypt, others plain text
- **Role Profiles**: User.profile references role-specific models
