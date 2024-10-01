import React, { useState } from 'react';
import BookCard from '../../components/BookCard/BookCard';
import SortAndFilterComponent from '../../components/SortAndFilter/SortAndFilter';
import './BookList.css';

const BookList = ({ books }) => {
  const [sortBy, setSortBy] = useState(null);
  const [filterByAvailability, setFilterByAvailability] = useState(null);
  const [filterByCondition, setFilterByCondition] = useState(null);

  const sortBooks = () => {
    if (sortBy === 'priceLowToHigh') {
      return books.sort((a, b) => a.buyPrice - b.buyPrice);
    } else if (sortBy === 'priceHighToLow') {
      return books.sort((a, b) => b.buyPrice - a.buyPrice);
    }
    return books;
  };

  const filterBooks = (book) => {
    let conditionFilter = true;
    if (filterByCondition) {
      conditionFilter = book.condition === filterByCondition;
    }
    let availabilityFilter = (!filterByAvailability == book.availability);
    return conditionFilter && availabilityFilter;
  };
  

  return (
    <div className="book-list-container">
      <SortAndFilterComponent 
        setSortBy={setSortBy}
        setFilterByAvailability={setFilterByAvailability}
        setFilterByCondition={setFilterByCondition}
        filterByAvailability={filterByAvailability}
      />
      <div className="book-list-content">
        {sortBooks().filter(filterBooks).map(book => (
          <div className="book-list-content-item" key={book._id}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookList;
