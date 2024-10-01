import React from 'react';
import './Home.css'; 
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='home-container'>
      <div className='home-left'>
        <p>Want to sell you existing collection of book, List it today!</p>
        <Link to={"/auth"} className='home-link'>Join Us</Link>
      </div>
      
        <div className='home-right'>
          <p>Want to Explore some of the worlds best collection of books!</p>
          <Link to={"/book"} className='home-link'>Explore</Link>
        </div>
      
    </div>
  );
};

export default Home;
