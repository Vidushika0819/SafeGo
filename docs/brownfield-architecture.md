# SafeGo Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the SafeGo bus management system codebase, including technical debt, workarounds, and real-world patterns. It serves as a reference for AI agents working on enhancements.

### Document Scope

Comprehensive documentation of the entire SafeGo system, a full-stack bus management application.

### Change Log

| Date   | Version | Description                 | Author    |
| ------ | ------- | --------------------------- | --------- |
| 9/30/2025 | 1.0     | Initial brownfield analysis | Analyst   |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry (Backend)**: `backend/app.js` - Express server setup and route configuration
- **Configuration**: `backend/.env` - Environment variables (MongoDB URI)
- **Core Business Logic**: `backend/Controllers/` - HTTP request handlers for all entities
- **API Definitions**: `backend/Routes/` - Route definitions for trips, buses, drivers, coordinators
- **Database Models**: `backend/Model/` - Mongoose schemas for all entities
- **Frontend Entry**: `frontend/src/index.js` - React app entry point
- **Main App Component**: `frontend/src/App.js` - React router setup
- **Key Components**: `frontend/src/components/` - UI components for each entity

### Enhancement Impact Areas

Since no specific PRD is provided, this documents the entire system for general enhancement planning.

## High Level Architecture

### Technical Summary

SafeGo is a full-stack web application for managing bus operations, including trips, buses, drivers, and coordinators. The backend provides REST APIs using Node.js and Express, with MongoDB as the database. The frontend is a React single-page application that consumes these APIs.

### Actual Tech Stack (from package.json/requirements.txt)

| Category  | Technology | Version | Notes                      |
| --------- | ---------- | ------- | -------------------------- |
| Runtime   | Node.js    | -       | Backend runtime            |
| Framework | Express    | 5.1.0   | Backend web framework      |
| Database  | MongoDB    | -       | NoSQL database with Mongoose ODM |
| ODM       | Mongoose   | 8.18.0  | MongoDB object modeling    |
| Frontend  | React      | 19.1.1  | UI framework               |
| Routing   | React Router | 7.9.3 | Client-side routing        |
| HTTP Client| Axios     | 1.11.0  | API communication         |
| Middleware| CORS       | 2.8.5   | Cross-origin requests      |
| Dev Tool  | Nodemon    | 3.1.10  | Backend development server |

### Repository Structure Reality Check

- Type: Monorepo (backend/ and frontend/ in same repository)
- Package Manager: npm
- Notable: Separate package.json files for backend and frontend, no monorepo tooling

## Source Tree and Module Organization

### Project Structure (Actual)

```
SafeGo/
├── backend/
│   ├── Controllers/
│   │   ├── BusControllers.js
│   │   ├── CoordinatorControllers.js
│   │   ├── DriverControllers.js
│   │   └── TripController.js
│   ├── Model/
│   │   ├── BusModel.js
│   │   ├── CoordinatorModel.js
│   │   ├── DriverModel.js
│   │   └── TripModel.js
│   ├── Routes/
│   │   ├── BusRoutes.js
│   │   ├── CoordinatorRoutes.js
│   │   ├── DriverRoutes.js
│   │   └── TripRoutes.js
│   ├── app.js
│   ├── package.json
│   └── .env (not committed)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Bus/
│   │   │   ├── Coordinator/
│   │   │   ├── Driver/
│   │   │   ├── Home/
│   │   │   ├── Nav/
│   │   │   └── Trip/
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   ├── index.js
│   │   └── reportWebVitals.js
│   ├── package.json
│   ├── public/
│   └── README.md
└── docs/ (to be created)
```

### Key Modules and Their Purpose

- **Trip Management**: `backend/Controllers/TripController.js` - Handles all trip CRUD operations with population of related entities
- **Bus Management**: `backend/Controllers/BusControllers.js` - Manages bus inventory and status
- **Driver Management**: `backend/Controllers/DriverControllers.js` - Driver information and assignment
- **Coordinator Management**: `backend/Controllers/CoordinatorControllers.js` - System coordinators
- **Trip Component**: `frontend/src/components/Trip/Trip.js` - Displays trip details with delete functionality
- **Navigation**: `frontend/src/components/Nav/Nav.js` - App navigation

## Data Models and APIs

### Data Models

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

#### Bus Model (BusModel.js)
- **busId**: String, required, unique - Bus identifier
- **busNumber**: String, required - Display number
- **busType**: String, required - Type of bus
- **capacity**: Number, required - Passenger capacity
- **status**: String, enum ['active', 'under maintenance', 'inactive'], required

#### Driver Model (DriverModel.js)
- **name**: String, required - Driver's full name
- **licenseNumber**: String, required, unique - Driver's license
- **phoneNumber**: String, required - Contact number
- **vehicleType**: String, required - Authorized vehicle type
- **vehicleNumber**: String, required, unique - Vehicle registration
- **age**: Number, required - Driver's age
- **experienceYears**: Number, required - Years of experience
- **email**: String, required, unique - Email address
- **address**: String, required - Residential address
- **password**: String, required - Authentication (NOTE: Plain text storage - security issue)

#### Coordinator Model (CoordinatorModel.js)
- **coordinatorId**: String, required, unique - Coordinator identifier
- **fullName**: String, required - Full name
- **phoneNumber**: String, required - Contact number
- **DOB**: Date, required - Date of birth
- **email**: String, required, unique - Email address
- **address**: String, required - Residential address
- **password**: String, required - Authentication (NOTE: Plain text storage - security issue)

### API Specifications

- **Base URL**: http://localhost:5005
- **Routes**:
  - `/trips` - Trip management endpoints
  - `/buses` - Bus management endpoints
  - `/drivers` - Driver management endpoints
  - `/coordinators` - Coordinator management endpoints

- **Common Patterns**:
  - GET /entity - Get all entities (with population for related data)
  - POST /entity - Create new entity
  - GET /entity/:id - Get entity by ID
  - PUT /entity/:id - Update entity by ID
  - DELETE /entity/:id - Delete entity by ID

- **Response Format**: JSON with consistent error handling
- **Population**: Trip queries populate busId, driverId, coordinatorId for complete data

## Technical Debt and Known Issues

### Critical Technical Debt

1. **Password Storage**: Plain text password storage in Driver and Coordinator models - major security vulnerability
2. **Error Handling**: Inconsistent error handling across controllers, some use console.log for errors
3. **Validation**: Basic mongoose validation but no custom business logic validation
4. **Authentication**: No authentication/authorization system implemented
5. **Environment Variables**: .env file not committed, hardcoded port and MongoDB URI reference
6. **Testing**: No test files or test scripts configured
7. **Frontend State Management**: No state management library, direct API calls in components
8. **CORS**: Enabled for all origins in development, no production configuration

### Workarounds and Gotchas

- **Port Hardcoding**: Backend runs on port 5005, frontend assumes localhost:5005 for API calls
- **MongoDB Connection**: Requires MONGODB_URI environment variable, connection string commented in app.js
- **Population Dependencies**: Trip queries depend on all related entities existing
- **Date Handling**: Frontend uses new Date().toLocaleDateString() for display
- **Delete Confirmation**: Frontend uses window.confirm() for delete operations
- **Page Refresh**: Uses window.location.reload() after operations instead of state updates

## Integration Points and External Dependencies

### External Services

| Service  | Purpose  | Integration Type | Key Files                      |
| -------- | -------- | ---------------- | ------------------------------ |
| MongoDB  | Database | Mongoose ODM     | All Model files                |

### Internal Integration Points

- **API Communication**: Frontend uses Axios to call backend APIs on localhost:5005
- **Data Flow**: Components make direct API calls, no centralized API layer
- **Navigation**: React Router handles client-side routing
- **State Updates**: Components use window.location.reload() for data refresh

## Development and Deployment

### Local Development Setup

1. **Backend Setup**:
   - cd backend
   - npm install
   - Create .env file with MONGODB_URI
   - npm run dev (uses nodemon)

2. **Frontend Setup**:
   - cd frontend
   - npm install
   - npm start (runs on port 3000)

3. **MongoDB**: Requires local or cloud MongoDB instance

### Build and Deployment Process

- **Backend Build**: No build step, runs directly with node
- **Frontend Build**: npm run build creates production build
- **Deployment**: Manual deployment, no CI/CD configured
- **Environments**: Single environment setup, no environment-specific configurations

## Testing Reality

### Current Test Coverage

- Unit Tests: None configured
- Integration Tests: None configured
- E2E Tests: None configured
- Manual Testing: Primary testing method

### Running Tests

- Backend: "test": "echo \"Error: no test specified\" && exit 1"
- Frontend: Uses React Testing Library but no actual tests written

## If Enhancement PRD Provided - Impact Analysis

Since no specific PRD is provided, general enhancement considerations:

### Files That May Need Modification

- All controller files for new API endpoints
- Model files for schema updates
- Frontend components for new UI features
- Routes for new endpoints

### New Files/Modules Needed

- Authentication middleware
- Password hashing utilities
- State management (Redux/Zustand)
- API service layer
- Test files

### Integration Considerations

- Authentication system integration
- State management across components
- API error handling standardization
- Environment configuration for production

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
npm run build
```

### Debugging and Troubleshooting

- **Backend Logs**: Console output from Express server
- **Frontend Errors**: Browser console for React errors
- **API Errors**: Check network tab for failed requests
- **Database Issues**: MongoDB connection errors in backend console
