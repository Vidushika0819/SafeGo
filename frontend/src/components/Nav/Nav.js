import React, { useState } from 'react'
import './Nav.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Nav() {
  const { isAdmin, isAuthenticated, user } = useAuth();
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showTripDropdown, setShowTripDropdown] = useState(false);
  const [showCoordinatorDropdown, setShowCoordinatorDropdown] = useState(false);
  const [showBusDropdown, setShowBusDropdown] = useState(false);

  // Determine user role for navigation filtering
  const getUserRole = () => {
    if (!isAuthenticated()) return null;
    if (isAdmin()) return 'admin';
    return user?.role || null;
  };

  const userRole = getUserRole();

  // Check if user can access operational functions (coordinator/driver level)
  const canAccessOperations = () => {
    return userRole === 'admin' || userRole === 'coordinator' || userRole === 'driver';
  };

  return (
    <div>
        <ul className="home-ul">
            <li className="home-ll">
                <Link to="/mainhome" className="active home-a">
                Home
                </Link>
            </li>

            {/* Driver Management - Show to Admin and Drivers */}
            {(userRole === 'admin' || userRole === 'driver') && (
                <li className="home-ll dropdown" onClick={() => setShowDriverDropdown(!showDriverDropdown)}>
                    <span className="dropbtn">Driver Management</span>
                    {showDriverDropdown && (
                        <div className="dropdown-content">
                            {userRole === 'admin' && (
                                <Link to="/adddriver" onClick={(e) => { e.stopPropagation(); setShowDriverDropdown(false); }}>Add Driver</Link>
                            )}
                            <Link to="/viewdriver" onClick={(e) => { e.stopPropagation(); setShowDriverDropdown(false); }}>View Drivers</Link>
                        </div>
                    )}
                </li>
            )}

            {/* Trip Management - Show to Admin, Coordinator, Driver */}
            {canAccessOperations() && (
                <li className="home-ll dropdown" onClick={() => setShowTripDropdown(!showTripDropdown)}>
                    <span className="dropbtn">Trip Management</span>
                    {showTripDropdown && (
                        <div className="dropdown-content">
                            {userRole === 'admin' && (
                                <Link to="/createtrip" onClick={(e) => { e.stopPropagation(); setShowTripDropdown(false); }}>Create Trip</Link>
                            )}
                            {userRole === 'admin' ? (
                                <Link to="/admin?section=trips" onClick={(e) => { e.stopPropagation(); setShowTripDropdown(false); }}>Manage Trips</Link>
                            ) : (
                                <Link to="/operational/dashboard" onClick={(e) => { e.stopPropagation(); setShowTripDropdown(false); }}>View Trips</Link>
                            )}
                        </div>
                    )}
                </li>
            )}

            {/* Coordinator Management - Show to Admin and Coordinators */}
            {(userRole === 'admin' || userRole === 'coordinator') && (
                <li className="home-ll dropdown" onClick={() => setShowCoordinatorDropdown(!showCoordinatorDropdown)}>
                    <span className="dropbtn">Coordinator Management</span>
                    {showCoordinatorDropdown && (
                        <div className="dropdown-content">
                            {userRole === 'admin' && (
                                <Link to="/addcoordinator" onClick={(e) => { e.stopPropagation(); setShowCoordinatorDropdown(false); }}>Add Coordinator</Link>
                            )}
                            <Link to="/viewcoordinator" onClick={(e) => { e.stopPropagation(); setShowCoordinatorDropdown(false); }}>View Coordinators</Link>
                        </div>
                    )}
                </li>
            )}

            {/* Bus Management - Show to Admin, Coordinator, Driver */}
            {canAccessOperations() && (
                <li className="home-ll dropdown" onClick={() => setShowBusDropdown(!showBusDropdown)}>
                    <span className="dropbtn">Bus Management</span>
                    {showBusDropdown && (
                        <div className="dropdown-content">
                            {userRole === 'admin' && (
                                <Link to="/addbus" onClick={(e) => { e.stopPropagation(); setShowBusDropdown(false); }}>Add Bus</Link>
                            )}
                            {userRole === 'admin' ? (
                                <Link to="/admin?section=buses" onClick={(e) => { e.stopPropagation(); setShowBusDropdown(false); }}>Manage Buses</Link>
                            ) : (
                                <Link to="/operational/dashboard" onClick={(e) => { e.stopPropagation(); setShowBusDropdown(false); }}>View Buses</Link>
                            )}
                        </div>
                    )}
                </li>
            )}

            {/* Admin Dashboard - Only for Admins */}
            {isAuthenticated() && isAdmin() && (
                <li className="home-ll">
                    <Link to="/admin" className="home-a">
                        Admin Dashboard
                    </Link>
                </li>
            )}

            {/* Parent Dashboard - Only for Parents */}
            {isAuthenticated() && userRole === 'parent' && (
                <li className="home-ll">
                    <Link to="/parent/dashboard" className="home-a">
                        Parent Dashboard
                    </Link>
                </li>
            )}

            {/* Operational Dashboard - For Coordinator and Driver */}
            {isAuthenticated() && (userRole === 'coordinator' || userRole === 'driver') && (
                <li className="home-ll">
                    <Link to="/operational/dashboard" className="home-a">
                        {userRole === 'coordinator' ? 'Coordinator' : 'Driver'} Dashboard
                    </Link>
                </li>
            )}
        </ul>
    </div>
  )
}

export default Nav
