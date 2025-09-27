import React, { useState } from 'react'
import './Nav.css';
import { Link } from 'react-router-dom';

function Nav() {
  const [showDriverDropdown, setShowDriverDropdown] = useState(false);
  const [showTripDropdown, setShowTripDropdown] = useState(false);

  return (
    <div>
        <ul className="home-ul">
            <li className="home-ll">
                <Link to="/mainhome" className="active home-a">
                Home
                </Link>
            </li>

            <li className="home-ll dropdown" onClick={() => setShowDriverDropdown(!showDriverDropdown)}>
                <span className="dropbtn">Driver Management</span>
                {showDriverDropdown && (
                    <div className="dropdown-content">
                        <Link to="/adddriver" onClick={(e) => { e.stopPropagation(); setShowDriverDropdown(false); }}>Add Driver</Link>
                        <Link to="/viewdriver" onClick={(e) => { e.stopPropagation(); setShowDriverDropdown(false); }}>View Drivers</Link>
                    </div>
                )}
            </li>

            <li className="home-ll dropdown" onClick={() => setShowTripDropdown(!showTripDropdown)}>
                <span className="dropbtn">Trip Management</span>
                {showTripDropdown && (
                    <div className="dropdown-content">
                        <Link to="/createtrip" onClick={(e) => { e.stopPropagation(); setShowTripDropdown(false); }}>Create Trip</Link>
                        <Link to="/viewtrips" onClick={(e) => { e.stopPropagation(); setShowTripDropdown(false); }}>View Trips</Link>
                    </div>
                )}
            </li>
        </ul>
    </div>
  )
}

export default Nav
