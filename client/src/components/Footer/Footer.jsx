import React from 'react';
import './Footer.css'; // Import the CSS file for Footer styling

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <h1>BookVerse</h1>
          <p>Your go-to place for all things books</p>
        </div>
        <div className="footer-right">
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
