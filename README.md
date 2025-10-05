# SafeGo - School Bus Seat Reservation System

## Project Structure

```
SafeGo/
├── backend/          # Node.js/Express API server
├── frontend/         # React student interface (Vite)
├── admin-dashboard/  # React admin interface (Vite)
│   └── admin-dashboard/
└── start-all.bat     # Convenience script to start all services
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository and navigate to the project directory**
   ```bash
   cd "c:\STUDY\Year 02\Year 02 Sem 02\Project\ITP\SafeGo"
   ```

2. **Install dependencies for all components:**

   **Backend:**
   ```bash
   cd backend
   npm install
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm install
   ```

   **Admin Dashboard:**
   ```bash
   cd admin-dashboard/admin-dashboard
   npm install
   ```

### Configuration

#### Backend Configuration
- Environment variables are configured in `backend/.env`
- MongoDB connection string is already set up
- Default port: 5000

#### Frontend Configuration
- API base URL configured in `frontend/.env`
- Default port: 3000

#### Admin Dashboard Configuration
- API base URL configured in `admin-dashboard/admin-dashboard/.env`
- Default port: 3001

### Running the Application

#### Option 1: Use Convenience Script (Recommended)
Double-click `start-all.bat` to start all services automatically.

#### Option 2: Manual Start
Open three separate terminals:

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Admin Dashboard:**
```bash
cd admin-dashboard/admin-dashboard
npm run dev
```

### Access URLs
- **Backend API:** http://localhost:5000
- **Student Frontend:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3001

### Features

#### Student Interface
- View bus routes and schedules
- Reserve seats
- Manage reservations
- Payment processing

#### Admin Dashboard
- Manage bus routes
- View and manage reservations
- Handle waitlists
- Seat management
- User management

### API Endpoints

#### Seat Management
- `GET /api/seats/bus/:busID` - Get seats by bus
- `POST /api/seats/generate` - Generate seats for bus

#### Reservation Management
- `POST /api/reservations` - Create reservation
- `GET /api/reservations` - Get reservations
- `PUT /api/reservations/:id` - Update reservation

#### Admin Management
- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile

#### Route Management
- `GET /api/routes` - Get all routes
- `POST /api/routes` - Create route
- `PUT /api/routes/:id` - Update route
- `DELETE /api/routes/:id` - Delete route

#### Bus Management
- `GET /api/buses` - Get all buses
- `GET /api/buses/route/:routeId` - Get buses by route

### Automated Features
- **Daily Cleanup:** Automatic cleanup of expired reservations at midnight
- **Reminders:** Daily reminder check at 9 AM for expiring reservations
- **Seat Management:** Automatic handling of temporary and regular reservations

### Development Notes
- The application uses MongoDB Atlas for data storage
- JWT authentication for admin users
- CORS enabled for cross-origin requests
- Automatic seat status management based on reservation types

### Troubleshooting

1. **Port conflicts:** Ensure ports 3000, 3001, and 5000 are available
2. **MongoDB connection:** Check internet connection and MongoDB Atlas credentials
3. **Module not found:** Run `npm install` in the respective directories
4. **CORS issues:** Ensure frontend URLs are properly configured in backend CORS settings

### Security Notes
- Change JWT_SECRET in production
- Use environment variables for sensitive data
- MongoDB credentials should be rotated regularly
- Enable MongoDB Atlas IP whitelisting in production