import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <Link to={`/book/${book._id}`} className="book-card-link">
      <div className="book-card">
        <div className="px-6 py-4">
          {book.image && (
            <img
              src={book.image}
              alt={book.title}
              className="book-card-image"
            />
          )}
          <div className="book-card-title">{book.title}</div>
          <p className="book-card-details">
            Author: {book.author}<br />
            Availability: {book.availability ? 'Available' : 'Not Available'}<br />
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
