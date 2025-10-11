import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const navigate = useNavigate();

  const handleParentLogin = () => {
    navigate('/parent/login');
  };

  const handleAdminLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>🚍 SafeGo</h2>
          </div>
          <div className="nav-buttons">
            <button className="nav-btn secondary" onClick={handleParentLogin}>
              Parent Portal
            </button>
            <button className="nav-btn primary" onClick={handleAdminLogin}>
              Admin Portal
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            SafeGo - Smart Bus Management System
          </h1>
          <p className="hero-subtitle">
            A comprehensive transportation management solution built with modern web technologies
          </p>
          <div className="hero-buttons">
            <button className="btn btn-primary-large" onClick={handleParentLogin}>
              👨‍👩‍👧‍👦 Parent Portal
              <span className="btn-description">Register/Login for Parents</span>
            </button>
            <button className="btn btn-secondary-large" onClick={handleAdminLogin}>
              🛠️ Admin Portal
              <span className="btn-description">Login for System Administrators</span>
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="bus-illustration">
            🚍
          </div>
        </div>
      </section>

      {/* System Overview */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">🚀 System Overview</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <div className="card-icon">🎯</div>
              <h3>Comprehensive Bus Management</h3>
              <p>
                SafeGo is a full-stack web application designed to streamline bus transportation operations.
                It provides a complete solution for managing buses, drivers, coordinators, trips, and passenger services.
              </p>
            </div>
            <div className="overview-card">
              <div className="card-icon">👥</div>
              <h3>Multi-Role Architecture</h3>
              <p>
                The system supports three distinct user roles: Administrators for system management,
                Coordinators for trip operations, and Drivers for route execution, each with tailored interfaces.
              </p>
            </div>
            <div className="overview-card">
              <div className="card-icon">🔒</div>
              <h3>Secure & Modern</h3>
              <p>
                Built with security-first approach using JWT authentication, role-based access control,
                and secure password hashing to protect user data and system integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">✨ Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🚌</div>
              <h3>Bus Fleet Management</h3>
              <ul>
                <li>Complete bus inventory tracking</li>
                <li>Vehicle maintenance scheduling</li>
                <li>Capacity and type management</li>
                <li>Real-time availability status</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🚗</div>
              <h3>Driver Management</h3>
              <ul>
                <li>Driver profile and licensing</li>
                <li>Vehicle assignments</li>
                <li>Performance tracking</li>
                <li>Schedule management</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎫</div>
              <h3>Trip Coordination</h3>
              <ul>
                <li>Route planning and scheduling</li>
                <li>Real-time trip monitoring</li>
                <li>Passenger capacity management</li>
                <li>Status updates and reporting</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Analytics & Reporting</h3>
              <ul>
                <li>Comprehensive dashboards</li>
                <li>Trip performance metrics</li>
                <li>User activity monitoring</li>
                <li>System health reports</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍👩‍👧‍👦</div>
              <h3>Parent Services</h3>
              <ul>
                <li>Child registration and tracking</li>
                <li>Trip assignment management</li>
                <li>Real-time trip updates</li>
                <li>Communication portal</li>
              </ul>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Security & Access</h3>
              <ul>
                <li>Role-based authentication</li>
                <li>Secure data encryption</li>
                <li>Audit logging</li>
                <li>Access control management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Interaction Patterns */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">👥 User Interaction Patterns</h2>
          <div className="interaction-grid">
            <div className="interaction-card">
              <div className="user-type">👨‍👩‍👧‍👦 Parents</div>
              <h3>Customer Portal</h3>
              <div className="interaction-flow">
                <div className="flow-step">
                  <span className="step-number">1</span>
                  <span>Register/Login</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">2</span>
                  <span>Register Children</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">3</span>
                  <span>View Trip Assignments</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">4</span>
                  <span>Track Real-time Updates</span>
                </div>
              </div>
              <button className="btn btn-primary" onClick={handleParentLogin}>
                Access Parent Portal
              </button>
            </div>

            <div className="interaction-card">
              <div className="user-type">🛠️ Administrators</div>
              <h3>System Management</h3>
              <div className="interaction-flow">
                <div className="flow-step">
                  <span className="step-number">1</span>
                  <span>Admin Login</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">2</span>
                  <span>Dashboard Overview</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">3</span>
                  <span>Manage Users/Roles</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">4</span>
                  <span>System Monitoring</span>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={handleAdminLogin}>
                Access Admin Portal
              </button>
            </div>

            <div className="interaction-card">
              <div className="user-type">🎫 Coordinators</div>
              <h3>Trip Operations</h3>
              <div className="interaction-flow">
                <div className="flow-step">
                  <span className="step-number">1</span>
                  <span>Coordinator Login</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">2</span>
                  <span>Trip Dashboard</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">3</span>
                  <span>Monitor/Manage Trips</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">4</span>
                  <span>Passenger Services</span>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={handleAdminLogin}>
                Access Coordinator Portal
              </button>
            </div>

            <div className="interaction-card">
              <div className="user-type">🚍 Drivers</div>
              <h3>Route Execution</h3>
              <div className="interaction-flow">
                <div className="flow-step">
                  <span className="step-number">1</span>
                  <span>Driver Login</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">2</span>
                  <span>View Assigned Trips</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">3</span>
                  <span>Update Trip Status</span>
                </div>
                <div className="flow-arrow">→</div>
                <div className="flow-step">
                  <span className="step-number">4</span>
                  <span>Report Issues</span>
                </div>
              </div>
              <button className="btn btn-secondary" onClick={handleAdminLogin}>
                Access Driver Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">⚙️ How SafeGo Works</h2>
          <div className="workflow-container">
            <div className="workflow-step">
              <div className="step-icon">🔐</div>
              <h3>Authentication</h3>
              <p>Users authenticate with role-based access control using JWT tokens</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-icon">📝</div>
              <h3>Data Management</h3>
              <p>CRUD operations for buses, drivers, coordinators, and trips</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-icon">🎫</div>
              <h3>Trip Coordination</h3>
              <p>Coordinators manage trip assignments and monitor progress</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-icon">🚍</div>
              <h3>Route Execution</h3>
              <p>Drivers execute routes with real-time status updates</p>
            </div>
            <div className="workflow-arrow">→</div>
            <div className="workflow-step">
              <div className="step-icon">📊</div>
              <h3>Monitoring & Analytics</h3>
              <p>Administrators monitor system performance and generate reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">🛠️ Technology Stack</h2>
          <div className="tech-stack">
            <div className="tech-category">
              <h3>Frontend</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-icon">⚛️</span>
                  <span>React 19.1.1</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🌐</span>
                  <span>React Router 7.9.3</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">📡</span>
                  <span>Axios 1.11.0</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🎨</span>
                  <span>CSS3 + Responsive Design</span>
                </div>
              </div>
            </div>

            <div className="tech-category">
              <h3>Backend</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-icon">🟢</span>
                  <span>Node.js</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🚀</span>
                  <span>Express.js 5.1.0</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🔐</span>
                  <span>JWT Authentication</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🔒</span>
                  <span>Bcrypt Password Hashing</span>
                </div>
              </div>
            </div>

            <div className="tech-category">
              <h3>Database</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-icon">🍃</span>
                  <span>MongoDB</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">📦</span>
                  <span>Mongoose ODM 8.18.0</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">☁️</span>
                  <span>Document-Based Storage</span>
                </div>
              </div>
            </div>

            <div className="tech-category">
              <h3>Development Tools</h3>
              <div className="tech-items">
                <div className="tech-item">
                  <span className="tech-icon">🔄</span>
                  <span>Nodemon 3.1.10</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🧪</span>
                  <span>Jest Testing</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">📡</span>
                  <span>CORS Enabled</span>
                </div>
                <div className="tech-item">
                  <span className="tech-icon">🔧</span>
                  <span>RESTful API Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="section section-alt">
        <div className="container">
          <h2 className="section-title">🏗️ System Architecture</h2>
          <div className="architecture-diagram">
            <div className="arch-layer frontend">
              <h3>Frontend Layer</h3>
              <p>React SPA with role-based routing and responsive UI components</p>
            </div>
            <div className="arch-arrow">↓</div>
            <div className="arch-layer api">
              <h3>API Layer</h3>
              <p>RESTful Express.js server with JWT authentication and middleware</p>
            </div>
            <div className="arch-arrow">↓</div>
            <div className="arch-layer database">
              <h3>Data Layer</h3>
              <p>MongoDB with Mongoose schemas and relationship management</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Experience SafeGo?</h2>
          <p>Explore the comprehensive bus management system with role-based access</p>
          <div className="cta-buttons">
            <button className="btn btn-primary-large" onClick={handleParentLogin}>
              👨‍👩‍👧‍👦 Start as Parent
            </button>
            <button className="btn btn-secondary-large" onClick={handleAdminLogin}>
              🛠️ Start as Administrator
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h3>🚍 SafeGo</h3>
              <p>Smart Bus Management System</p>
            </div>
            <div className="footer-info">
              <p><strong>University Project:</strong> MERN Stack Transportation Management System</p>
              <p><strong>Technologies:</strong> React, Node.js, Express, MongoDB, JWT, bcrypt</p>
              <p><strong>Features:</strong> Role-based access, real-time updates, secure authentication</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SafeGo - Bus Management System. Built for educational purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
