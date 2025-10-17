m # SafeGo Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Analysis Source
Document-project output available at: docs/brownfield-architecture.md

### Current Project State
SafeGo is a full-stack web application for managing bus operations, including trips, buses, drivers, and coordinators. The backend provides REST APIs using Node.js and Express, with MongoDB as the database. The frontend is a React single-page application that consumes these APIs.

### Enhancement Scope Definition

#### Enhancement Type
Major enhancement (multiple epics) - Complete the system with authentication, role-based access, improved UI, and security fixes

#### Enhancement Description
Transform the current basic CRUD system into a complete, working bus management prototype that demonstrates MERN stack concepts. Add user authentication, role-based dashboards (admin, coordinator/conductor, driver), improved UI/UX with responsive web design, proper data validation, security fixes (password hashing), and features suitable for university assignment evaluation.

#### Impact Assessment
Significant Impact (substantial existing code changes) - Requires adding authentication system, modifying all UI components, updating data models, implementing role-based access control, and fixing security vulnerabilities.

### Goals and Background Context

#### Goals
- Create a complete, working bus management system prototype
- Demonstrate key MERN stack concepts and best practices
- Provide role-based access for different user types (admin, coordinator, driver)
- Ensure the system is easy to demonstrate and evaluate
- Fix security issues and implement proper authentication
- Create clean, well-structured, and commented code

#### Background Context
This is a university assignment requiring a transportation management system prototype. The system needs to showcase core functionality of a bus management application while demonstrating web development concepts. The focus is on educational value and clear demonstration of MERN stack principles rather than production-level robustness.

### Change Log

| Date | Version | Description | Author |
| ---- | ------- | ----------- | ------ |
| 9/30/2025 | 1.0 | Initial brownfield PRD for SafeGo enhancement | PM |

## Requirements

### Functional

FR1: User authentication system with secure login/logout functionality
FR2: Role-based access control with three user types (admin, coordinator, driver)
FR3: Admin dashboard providing full CRUD access to all system entities
FR4: Coordinator dashboard for managing trips and buses with appropriate permissions
FR5: Driver dashboard for viewing assigned trips and personal information
FR6: Secure password hashing and storage replacing current plain text implementation
FR7: Comprehensive input validation for all forms and API endpoints
FR8: Responsive web design optimized for desktop browsers
FR9: Enhanced CRUD operations with proper authorization checks
FR10: User session management with automatic logout on inactivity

### Non Functional

NFR1: Clean, well-structured, and commented code demonstrating MERN stack best practices
NFR2: Responsive design ensuring usability on standard desktop screen sizes
NFR3: Fast loading times for typical CRUD operations (under 2 seconds)
NFR4: Secure authentication system preventing unauthorized access to sensitive data
NFR5: Intuitive user interface suitable for university assignment evaluation
NFR6: Error handling with user-friendly messages for validation failures
NFR7: Data integrity maintained through proper validation and constraints

### Compatibility Requirements

CR1: Existing API endpoints remain functional during transition
CR2: Database schema changes are backward compatible with existing data
CR3: No breaking changes to current trip/bus/driver/coordinator data structure
CR4: Integration with existing MongoDB setup and connection configuration

## User Interface Enhancement Goals

### Integration with Existing UI

The enhancement will build upon the existing React component structure while introducing consistent design patterns. New authentication components will follow the current component naming conventions (e.g., Login.js, Dashboard.js). Role-based dashboards will extend the existing navigation structure, maintaining the current routing approach with React Router. Form components will be enhanced with validation feedback while preserving the existing input styling patterns.

### Modified/New Screens and Views

- **New: Login Page** - Authentication interface with role selection
- **New: Admin Dashboard** - Comprehensive overview with management widgets for all entities
- **New: Coordinator Dashboard** - Focused on trip and bus management with assignment tools
- **New: Driver Dashboard** - Simplified view for trip information and status updates
- **Modified: All CRUD Forms** - Enhanced with validation, better UX, and role-appropriate fields
- **Modified: Navigation** - Updated to include authentication state and role-based menu options
- **New: Profile/Settings Page** - User account management for all roles

### UI Consistency Requirements

- Maintain existing component structure and naming conventions
- Preserve current color scheme and basic styling approach
- Ensure responsive design works on desktop browsers as primary target
- Keep navigation patterns consistent across role-based dashboards
- Maintain form layout consistency while adding validation indicators
- Ensure error messages and success feedback follow consistent styling

## Technical Constraints and Integration Requirements

### Existing Technology Stack

**Languages**: JavaScript (Node.js backend, React frontend)
**Frameworks**: Express.js 5.1.0 (backend), React 19.1.1 (frontend)
**Database**: MongoDB with Mongoose ODM 8.18.0
**Authentication**: None currently (to be added)
**Frontend Libraries**: Axios 1.11.0 for API calls, React Router 7.9.3 for routing
**Development Tools**: Nodemon 3.1.10 for backend development

### Integration Approach

**Database Integration Strategy**: Extend existing Mongoose models with authentication fields, maintain current schema relationships
**API Integration Strategy**: Add authentication middleware to existing routes, implement role-based authorization checks
**Frontend Integration Strategy**: Add authentication context and protected routes, modify existing components for role-based rendering
**Testing Integration Strategy**: Add basic authentication tests while maintaining existing manual testing approach

### Code Organization and Standards

**File Structure Approach**: Add authentication models, middleware, and services following existing backend/Controllers and frontend/components patterns
**Naming Conventions**: Maintain existing camelCase for JavaScript, PascalCase for React components
**Coding Standards**: Follow existing patterns (async/await, error handling with try/catch, consistent imports)
**Documentation Standards**: Add JSDoc comments for new authentication functions, maintain existing inline comments approach

### Deployment and Operations

**Build Process Integration**: No changes needed - existing npm scripts sufficient
**Deployment Strategy**: Maintain current manual deployment approach
**Monitoring and Logging**: Add basic authentication logging to existing console-based approach
**Configuration Management**: Add environment variables for JWT secrets and session configuration

### Risk Assessment and Mitigation

**Technical Risks**: Password hashing implementation complexity, role-based authorization edge cases, session management security
**Integration Risks**: Breaking existing API functionality during middleware addition, frontend state management conflicts
**Deployment Risks**: Environment variable configuration issues, authentication state persistence problems
**Mitigation Strategies**: Implement authentication incrementally with testing, maintain backward compatibility, add comprehensive error handling

## Epic and Story Structure

### Epic Approach

**Epic Structure Decision**: Multiple epics (6 total) with logical sequencing to build authentication foundation first, then role-specific functionality. This approach allows incremental development and testing of each user role's capabilities.

**Epic 1: Authentication Foundation**
Establish secure user authentication and basic role-based access control system.

**Epic 2: Admin Management System**
Create comprehensive admin dashboard for full system management and oversight.

**Epic 3: Coordinator Operations Hub**
Build a coordinator (conductor) interface for trip monitoring and basic operational tasks.

**Epic 4: Driver Experience Portal**
Develop a driver dashboard for trip information and status updates.

**Epic 5: UI/UX Polish & Enhancement**
Improve overall user interface, responsiveness, and user experience.

**Epic 6: Security Hardening & Validation**
Implement final security fixes, input validation, and system hardening.

## Epic 1: Authentication Foundation

**Epic Goal**: Implement a secure authentication system that allows users to register, login, and logout while establishing role-based access control. This foundation will enable different user types (admin, coordinator, driver) to access appropriate system functions while maintaining security and data integrity.

### Story 1.1: User Registration System

As a new user, I want to register with the system so that I can create an account with appropriate role assignment.

#### Acceptance Criteria
1. Registration form accepts email, password, role selection (admin/coordinator/driver), and role-specific fields
2. Password validation requires minimum 8 characters with complexity rules
3. Email uniqueness validation prevents duplicate accounts
4. Role-specific additional fields collected (license number for drivers, etc.)
5. Successful registration creates user account with hashed password
6. User receives confirmation of successful registration

#### Integration Verification
IV1: Existing system data remains intact during user table creation
IV2: Registration integrates with existing MongoDB connection
IV3: New user model follows existing Mongoose schema patterns

### Story 1.2: Secure Login Implementation

As a registered user, I want to login securely so that I can access the system with proper authentication.

#### Acceptance Criteria
1. Login form accepts email and password
2. Invalid credentials show appropriate error messages
3. Successful login generates JWT token for session management
4. Token includes user role information for authorization
5. Login state persists across page refreshes
6. Logout functionality clears session and redirects to login

#### Integration Verification
IV1: Login integrates with existing Express routes without breaking current API structure
IV2: JWT tokens work with existing CORS configuration
IV3: Login state integrates with existing React component structure

### Story 1.3: Password Security Enhancement

As a system administrator, I want passwords to be securely hashed so that user credentials are protected.

#### Acceptance Criteria
1. All existing plain text passwords are migrated to hashed versions
2. New passwords are hashed using bcrypt before storage
3. Password hashing uses appropriate salt rounds for security
4. Password comparison functions work correctly for login
5. Migration process preserves existing user accounts
6. No breaking changes to existing user data structure

#### Integration Verification
IV1: Password hashing integrates with existing User model schema
IV2: Migration process preserves existing MongoDB data
IV3: Login functionality continues working with hashed passwords

### Story 1.4: Role-Based Authorization Middleware

As a system developer, I want role-based middleware so that API endpoints can enforce access control.

#### Acceptance Criteria
1. Middleware checks JWT token validity on protected routes
2. Middleware extracts user role from token
3. Admin role has access to all endpoints
4. Coordinator role has access to trip and bus management endpoints
5. Driver role has access to personal trip information only
6. Unauthorized access returns appropriate error responses

#### Integration Verification
IV1: Middleware integrates with existing route structure without breaking current endpoints
IV2: Role checks work with existing API authorization
IV3: Error handling follows existing API error format

### Story 1.5: Session Management

As a logged-in user, I want my session to be properly managed so that I stay authenticated during use.

#### Acceptance Criteria
1. JWT tokens have appropriate expiration time
2. Automatic logout on token expiration
3. Manual logout clears client-side session data
4. Session persistence across browser refreshes
5. Invalid token handling with redirect to login
6. Concurrent session management (single session per user)

#### Integration Verification
IV1: Session management integrates with existing React state management
IV2: Token expiration works with existing API timeout handling
IV3: Logout integrates with existing navigation patterns

## Epic 2: Admin Management System

**Epic Goal**: Create a comprehensive admin dashboard that provides complete oversight and management capabilities for the entire SafeGo system. The admin interface will enable system administrators to manage all users, view system statistics, and perform administrative operations while maintaining security and providing an intuitive management experience.

### Story 2.1: Admin Dashboard Layout

As an admin user, I want a comprehensive dashboard so that I can access all system management functions.

#### Acceptance Criteria
1. Admin dashboard displays after successful admin login
2. Dashboard includes navigation to all management sections
3. Overview statistics show total users, trips, buses, coordinators
4. Quick action buttons for common admin tasks
5. Responsive layout optimized for desktop administration
6. Clear visual hierarchy separates different management areas

#### Integration Verification
IV1: Admin dashboard integrates with existing authentication system
IV2: Dashboard components follow existing React patterns
IV3: Statistics API calls work with existing backend structure

### Story 2.2: User Management Interface

As an admin user, I want to manage all system users so that I can add, edit, and remove user accounts.

#### Acceptance Criteria
1. User list displays all users with roles and status
2. Add new user functionality with role assignment
3. Edit existing user details and roles
4. Deactivate/reactivate user accounts
5. Bulk user operations for efficiency
6. Search and filter capabilities for large user lists

#### Integration Verification
IV1: User management integrates with existing user authentication system
IV2: CRUD operations work with existing API patterns
IV3: Role changes update existing authorization middleware

### Story 2.3: System Statistics and Monitoring

As an admin user, I want to view system statistics so that I can monitor system health and usage.

#### Acceptance Criteria
1. Real-time statistics for active trips, available buses, user counts
2. Historical data charts for trip completion rates
3. System performance metrics (response times, error rates)
4. User activity logs and recent actions
5. Export functionality for reports
6. Alert system for critical system issues

#### Integration Verification
IV1: Statistics integrate with existing database queries
IV2: Charts use appropriate frontend libraries compatible with existing setup
IV3: Monitoring doesn't impact existing system performance

### Story 2.4: Admin Permissions and Security

As an admin user, I want guaranteed access to all system functions so that I can perform necessary administrative tasks.

#### Acceptance Criteria
1. Admin role bypasses all authorization checks appropriately
2. Admin actions are logged for audit purposes
3. Admin interface shows all available system data
4. Admin can modify any system entity
5. Admin access is protected by additional security measures
6. Admin actions include confirmation dialogs for destructive operations

#### Integration Verification
IV1: Admin permissions work with existing role-based middleware
IV2: Admin logging integrates with existing application logging patterns
IV3: Admin access doesn't compromise existing user security

## Epic 3: Coordinator Operations Hub

**Epic Goal**: Build a coordinator (conductor) interface that provides operational support for bus trips while maintaining appropriate access controls. Coordinators will monitor trip progress, update statuses, handle passenger-related tasks, and report issues, functioning more like an enhanced driver role rather than an administrative position.

### Story 3.1: Coordinator Dashboard Interface

As a coordinator (conductor), I want a dashboard so that I can view my assigned trips and current status.

#### Acceptance Criteria
1. Coordinator dashboard shows trips assigned to the logged-in coordinator
2. Current trip status and next scheduled trips displayed
3. Basic trip information (route, timing, bus assignment)
4. Quick status update buttons for common actions
5. Coordinator-specific navigation (no admin functions)
6. Mobile-friendly interface for on-the-go access

#### Integration Verification
IV1: Coordinator dashboard integrates with existing authentication for conductor role
IV2: Trip filtering works with existing coordinatorId relationships
IV3: Dashboard follows existing React component patterns

### Story 3.2: Trip Status Updates

As a coordinator, I want to update trip status so that I can track trip progress in real-time.

#### Acceptance Criteria
1. Status update from "scheduled" to "ongoing" at trip start
2. Status update to "completed" or "canceled" as appropriate
3. Delay reporting with reason codes
4. Emergency status updates for incidents
5. Status change history for accountability
6. Automatic notifications to relevant parties

#### Integration Verification
IV1: Status updates work with existing trip status enum
IV2: Status changes integrate with existing API endpoints
IV3: Coordinator notifications work with existing system

### Story 3.3: Passenger and Trip Management

As a coordinator, I want to manage passenger-related information so that I can handle boarding and trip operations.

#### Acceptance Criteria
1. View passenger capacity and current load
2. Boarding pass validation (if implemented)
3. Special passenger requirements handling
4. Trip manifest viewing and updates
5. Passenger assistance request handling
6. Basic trip notes and observations

#### Integration Verification
IV1: Passenger management integrates with existing bus capacity fields
IV2: Trip manifest works with existing trip data structure
IV3: Updates follow existing API patterns

### Story 3.4: Issue Reporting and Communication

As a coordinator, I want to report issues so that problems can be addressed quickly.

#### Acceptance Criteria
1. Emergency issue reporting (mechanical, passenger, route issues)
2. Communication with dispatch/admin for support
3. Incident documentation with timestamps
4. Photo/evidence attachment capabilities
5. Follow-up status tracking for reported issues
6. Emergency contact information readily available

#### Integration Verification
IV1: Issue reporting integrates with existing trip update functionality
IV2: Communication system works with existing coordinator relationships
IV3: Incident logging follows existing data storage patterns

### Story 3.5: Coordinator Profile and Schedule

As a coordinator, I want to manage my profile and view my schedule so that I can maintain accurate information.

#### Acceptance Criteria
1. Profile information viewing and editing
2. Schedule viewing for upcoming trips
3. Contact information updates
4. Availability status management
5. Trip history and performance metrics
6. Basic account settings

#### Integration Verification
IV1: Profile management integrates with existing coordinator model
IV2: Schedule viewing works with existing trip assignments
IV3: Updates follow existing user management patterns

## Epic 4: Driver Experience Portal

**Epic Goal**: Develop a driver-focused dashboard that provides essential trip information, route details, and status update capabilities. Drivers will have a simplified interface optimized for quick access to critical information while driving, with appropriate limitations to ensure safety and focus on driving responsibilities.

### Story 4.1: Driver Dashboard Interface

As a driver, I want a simple dashboard so that I can quickly access my trip information.

#### Acceptance Criteria
1. Driver dashboard displays after login with driver role
2. Current trip prominently displayed with key information
3. Large, easy-to-read status indicators
4. Minimal navigation to reduce distraction
5. Voice-guided options for hands-free operation
6. Emergency quick-access buttons

#### Integration Verification
IV1: Driver dashboard integrates with existing driver authentication
IV2: Dashboard follows existing responsive design patterns
IV3: Interface works on various screen sizes for different vehicles

### Story 4.2: Trip Details and Route Information

As a driver, I want to view my assigned trip details so that I can prepare for the route.

#### Acceptance Criteria
1. Complete trip itinerary with stops and timing
2. Route map or turn-by-turn directions
3. Bus assignment and vehicle details
4. Passenger capacity and special requirements
5. Contact information for coordinator and support
6. Weather and traffic considerations

#### Integration Verification
IV1: Trip details integrate with existing trip data structure
IV2: Route information works with existing location fields
IV3: Real-time updates work with existing API patterns

### Story 4.3: Trip Status Updates

As a driver, I want to update trip status so that the system reflects current progress.

#### Acceptance Criteria
1. One-click status updates (started, delayed, completed)
2. Pre-defined delay reasons for quick selection
3. Emergency stop/breakdown reporting
4. Automatic GPS-based status updates (if available)
5. Status confirmation with coordinator
6. Trip completion verification

#### Integration Verification
IV1: Status updates work with existing trip status enum
IV2: Status changes integrate with existing API endpoints
IV3: Coordinator notifications work with existing system

### Story 4.4: Driver Communication Tools

As a driver, I want communication tools so that I can coordinate with coordinators and report issues.

#### Acceptance Criteria
1. Direct messaging with assigned coordinator
2. Pre-defined message templates for common situations
3. Emergency alert system
4. Location sharing for coordination
5. Trip delay notifications
6. Support contact information

#### Integration Verification
IV1: Communication integrates with existing coordinator relationships
IV2: Messaging works with existing API structure
IV3: Emergency alerts follow existing notification patterns

### Story 4.5: Driver Profile and Vehicle Management

As a driver, I want to manage my profile and vehicle information so that I can maintain accurate records.

#### Acceptance Criteria
1. Driver license and certification updates
2. Vehicle assignment viewing and updates
3. Maintenance issue reporting
4. Fuel and mileage logging
5. Personal schedule and availability
6. Performance metrics and feedback

#### Integration Verification
IV1: Profile management integrates with existing driver model
IV2: Vehicle information works with existing bus assignments
IV3: Updates follow existing data validation patterns

## Epic 5: UI/UX Polish & Enhancement

**Epic Goal**: Improve the overall user interface and user experience across the SafeGo web application to create a polished, professional prototype suitable for university evaluation. Focus on desktop-oriented responsive design that works well in web browsers while maintaining clean, functional interfaces that effectively demonstrate the system's capabilities.

### Story 5.1: Web Browser Responsive Design

As a user, I want the interface to work properly in web browsers so that I can access the system from desktop computers.

#### Acceptance Criteria
1. Desktop browser compatibility (Chrome, Firefox, Safari, Edge)
2. Responsive design that adapts to different browser window sizes
3. Readable text and appropriate element sizing for desktop use
4. Proper layout adaptation for widescreen and standard monitors
5. Consistent experience across different browser zoom levels
6. Focus on web prototype functionality demonstration

#### Integration Verification
IV1: Browser compatibility integrates with existing React build
IV2: Responsive layouts work with existing CSS structure
IV3: Performance maintained across different browser environments

### Story 5.2: UI Component Standardization

As a developer, I want consistent UI components so that the interface feels cohesive and professional.

#### Acceptance Criteria
1. Standardized button styles and behaviors
2. Consistent form input styling and validation feedback
3. Unified color scheme and typography
4. Consistent spacing and layout patterns
5. Reusable component library for common elements
6. Design system documentation for maintenance

#### Integration Verification
IV1: Component standardization works with existing component library
IV2: Style changes don't break existing functionality
IV3: Component library integrates with existing development patterns

### Story 5.3: Navigation and Information Architecture

As a user, I want intuitive navigation so that I can easily find and access system functions.

#### Acceptance Criteria
1. Clear navigation hierarchy for each user role
2. Breadcrumb navigation for complex workflows
3. Search functionality for finding trips, users, buses
4. Contextual help and tooltips
5. Consistent navigation patterns across role dashboards
6. Keyboard navigation support

#### Integration Verification
IV1: Navigation improvements integrate with existing routing
IV2: Search functionality works with existing API endpoints
IV3: Help systems integrate with existing UI patterns

### Story 5.4: Form Validation and User Feedback

As a user, I want clear feedback when using forms so that I can correct errors and understand system responses.

#### Acceptance Criteria
1. Real-time validation feedback on form inputs
2. Clear error messages for validation failures
3. Success confirmations for completed actions
4. Loading states during API calls
5. Progress indicators for multi-step processes
6. Accessible error messaging for screen readers

#### Integration Verification
IV1: Form validation integrates with existing form components
IV2: Error messages work with existing API error responses
IV3: Loading states integrate with existing async operations

### Story 5.5: Visual Design and Branding

As a user, I want an attractive interface so that the system appears professional and trustworthy.

#### Acceptance Criteria
1. Clean, modern visual design
2. Consistent branding elements throughout
3. Appropriate use of white space and visual hierarchy
4. Professional color scheme suitable for transportation
5. High-quality icons and visual elements
6. Consistent visual language across all interfaces

#### Integration Verification
