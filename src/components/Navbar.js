import React from "react";
import './Navbar.css'
import { Link } from "react-router-dom";
import searchIcon from '../icons/search.svg'

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/">
      <h1>
        <span>casa</span>
        <span>.ly</span>
      </h1>
      </Link>
      <form>
      <input type="text" placeholder="Search..." />
      <img src={searchIcon} alt="search-icon" />
      </form>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/sign-in">Sign In</Link>
      </nav>
    </div>
  );
}

export default Navbar;
