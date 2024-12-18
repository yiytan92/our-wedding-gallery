import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/seating">Seating</Link></li>
        <li><Link to="/venue">Venue</Link></li>
        <li><Link to="/invitation">FAQ</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;
