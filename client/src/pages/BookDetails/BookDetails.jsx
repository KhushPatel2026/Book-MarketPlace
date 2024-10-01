import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [currentUser, setCurrentUser] = useState(null); 
  const [showDeleteButton, setShowDeleteButton] = useState(false); 
  const [showFullDesc, setShowFullDesc] = useState(false);

  useEffect(() => {

    if(token) {
    axios.get('http://localhost:3000/users/user-details', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setCurrentUser(response.data);
    })
    .catch(error => {
      console.error('Error fetching user details:', error);
    });
  }

    axios.get(`http://localhost:3000/book/${id}`)
      .then(response => {
        setBook(response.data);
        setImageUrl(response.data.image);
        if (currentUser && response.data.owner._id === currentUser._id) {
          setShowDeleteButton(true);
        }
      })
      .catch(error => {
        console.error('Error fetching book details:', error);
      });
  }, [id, token, currentUser,navigate]);

  const handleDelete = () => {
    console.log('Deleting book:', id)
    axios.delete(`http://localhost:3000/book/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        console.log('Book deleted:', response.data);
        navigate('/books');
      })
      .catch(error => {
        console.error('Error deleting book:', error);
      });
  };

  const toggleDesc = () => {
    console.log('Book:', book);
    setShowFullDesc(!showFullDesc);
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { book } });
  };

  const handleChangeAvailability = (id, availability) => {
    axios.put(`http://localhost:3000/book/${id}`, { availability: !availability },{
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(() => {
        setBook(prevBooks => {
          return prevBooks.map(book => {
            if (book._id === id) {
              return { ...book, availability: !availability };
            }
            return book;
          });
        });
        navigate(`/book/${id}`);
      })
      .catch(error => {
        console.error('Error updating availability:', error);
      });
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  const description = showFullDesc ? book.desc : book.desc.split(' ').slice(0, 60).join(' ');

  return (
    <div className='bookdetails-container'>
      <div className='image-box'>
        {imageUrl && <img src={imageUrl} alt="Book Cover" />}
      </div>
      <div className='details'>
        <h2>{book.title}</h2>
        <p>Author: {book.author}</p>
        <p>Condition: {book.condition}</p>
        <p className="text-lg mb-2">Description: {description}</p>
          {book.desc.split(' ').length > 80 && (
            <a onClick={toggleDesc}>{showFullDesc ? 'Read Less' : 'Read More'}</a>
          )}
        <p>Selling Price: ₹{book.buyPrice}</p>
        <p>Rent Price: ₹{book.rentPrice} / day</p>
        <p>Availability: {book.availability ? 'Available' : 'Out of Stock'}</p>
        {showDeleteButton && (
          <>
            <button onClick={handleDelete}>Delete</button>
            {!book.availability && <button onClick={() => handleChangeAvailability(book._id, book.availability)}>Change Availability</button>}
          </>
        )}
        {!showDeleteButton && token && (
          <button onClick={handleCheckout}>Checkout</button>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
