import React from 'react';
import './SortAndFilter.css';

const SortAndFilterComponent = ({ setSortBy, setFilterByAvailability, setFilterByCondition, filterByAvailability }) => {
  return (
      <div className='filter'>
        <div className='filter-bar'>
            <button onClick={() => setSortBy('priceLowToHigh')}>
                Sort by Price (Low to High)
            </button>
            <button onClick={() => setSortBy('priceHighToLow')}>
                Sort by Price (High to Low)
            </button>
            <button onClick={() => setFilterByCondition('new')}>
                New
            </button>
            <button onClick={() => setFilterByCondition('old')}>
                Old
            </button>
            <button onClick={() => setFilterByAvailability(prevState => !prevState)}>
                {!filterByAvailability ? 'Out of Stock' : 'Available'}
            </button>
        </div>
      </div>
  );
};

export default SortAndFilterComponent;
