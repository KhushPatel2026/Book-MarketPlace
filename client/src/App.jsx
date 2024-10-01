import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Auth from './pages/Auth/Auth';
import Home from './pages/Home/Home';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Profile from './pages/Profile/Profile';
import AddBookForm from './pages/AddBook/AddBookForm';
import BookList from './pages/BookList/BookList';
import BookDetails from './pages/BookDetails/BookDetails';
import CheckOut from './pages/CheckOutPage/CheckOutPage';
import CompletePayment from './pages/CompletePayment/CompletePayment';
import './App.css';

const App = () => {

  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/book/')
      .then(response => {
        setBooks(response.data);
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []);

  const handleSearch = (searchQuery) => {
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredBooks);
  };

  return (
      <div>
        <Navbar onSearch={handleSearch}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addbook" element={<AddBookForm />} />
          <Route path="/book" element={<BookList books={searchResults.length > 0 ? searchResults : books} />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/completepayment" element={<CompletePayment />} />
        </Routes>
        <Footer />
      </div>
  );
};

export default App;
