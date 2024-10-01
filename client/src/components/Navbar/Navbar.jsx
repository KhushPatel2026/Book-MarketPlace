import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { CiSearch } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { IoIosLogIn } from "react-icons/io"
import './Navbar.css';

const Navbar = ({ onSearch }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    checkLoginStatus();
  }, [location]);

  const checkLoginStatus = () => {
    try {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    onSearch(searchQuery);
    navigate('/book');
  };

  return (
    <div className='content'>
      <nav className='navbar'>
        <div>
          <Link to={"/"}><h1>BookVerse</h1></Link>
        </div>
        <div className='searchBar'>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search by title, author..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button type="submit"><CiSearch /></button>
          </form>
        </div>
        <div className='icons'>
          {isLoggedIn ? (
            <>
              <Link to="/profile">
                <CgProfile />
              </Link>
              <button onClick={handleLogout}><IoIosLogOut /></button>
            </>
          ) : (
            <>
              <Link to="/auth"><IoIosLogIn /></Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
