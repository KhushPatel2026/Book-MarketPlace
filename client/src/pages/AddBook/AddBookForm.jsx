import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddBookForm.css';

const AddBookForm = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) {
      navigate('/login');
    }
  }, [navigate]);

  const [book, setBook] = useState({
    title: '',
    author: '',
    desc: '',
    condition: '',
    saleType: '',
    buyPrice: '',
    rentPrice: '',
    availability: true,
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBook(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setBook(prevState => ({
      ...prevState,
      image: imageFile
    }));

    // Create a preview of the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(imageFile);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const imageFile = event.dataTransfer.files[0];
    setBook(prevState => ({
      ...prevState,
      image: imageFile
    }));

    // Create a preview of the image
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(imageFile);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.log('Token not found in local storage');
        return;
      }

      const formData = new FormData();
      formData.append('title', book.title);
      formData.append('author', book.author);
      formData.append('desc', book.desc);
      formData.append('condition', book.condition);
      formData.append('saleType', book.saleType);
      formData.append('buyPrice', book.buyPrice);
      formData.append('rentPrice', book.rentPrice);
      formData.append('availability', book.availability);
      formData.append('image', book.image);

      const response = await axios.post(
        'http://localhost:3000/book/addbook',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      console.log('Book added:', response.data);
      navigate('/book');
      setBook({
        title: '',
        author: '',
        desc: '',
        condition: '',
        saleType: '',
        buyPrice: '',
        rentPrice: '',
        availability: true,
        image: null
      });
      setImagePreview(null);
    } catch (error) {
      navigate('/auth');
      console.error('Error adding book:', error);
    }
  };

  return (
    <div className='addbook-container'>
        <form onSubmit={handleSubmit} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} className='overall-box'>
          <div className='addbook-title'>
            <h2>Add Book</h2>
          </div>
          <div className='form-box'>
            <div className='input-box'>
              <div>
                <label className='addbook-label'>Title:</label>
                <input
                  type="text"
                  placeholder="Title"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                  required
                  className='addbook-input'
                />
              </div>
              <div>
                <label className='addbook-label'>Author:</label>
                <input
                  type="text"
                  placeholder="Author"
                  name="author"
                  value={book.author}
                  onChange={handleChange}
                  required
                  className='addbook-input'
                />
              </div>
              <div>
                <label className='addbook-label'>Description:</label>
                <textarea
                  placeholder="Description"
                  name="desc"
                  value={book.desc}
                  onChange={handleChange}
                  required
                  className='addbook-input description'
                ></textarea>
              </div>
              <div>
                <label className='addbook-label'>Condition:</label>
                <select
                  name="condition"
                  value={book.condition}
                  onChange={handleChange}
                  required
                  className='addbook-input'
                >
                  <option value="">Select Condition</option>
                  <option value="new">New</option>
                  <option value="old">Old</option>
                </select>
              </div>
              <div>
                <label className='addbook-label'>Buy Price:</label>
                <input
                  type="number"
                  placeholder="Buy Price"
                  name="buyPrice"
                  value={book.buyPrice}
                  onChange={handleChange}
                  required={book.saleType === 'sale'} // Require buy price only if sale type is 'sale'
                  disabled={book.saleType === 'rent'}
                  className='addbook-input' // Disable buy price field if sale type is 'rent'
                />
              </div>
              <div>
                <label className='addbook-label'>Rent Price per Day:</label>
                <input
                  type="number"
                  placeholder="Rent Price"
                  name="rentPrice"
                  value={book.rentPrice}
                  onChange={handleChange}
                  required={book.saleType === 'rent'} // Require rent price only if sale type is 'rent'
                  disabled={book.saleType === 'sale'}
                  className='addbook-input' // Disable rent price field if sale type is 'sale'
                />
              </div>
            </div>
            <div className="image-box">
              <label className="addbook-label">Image:</label>
              <div className={`file-upload ${dragOver ? 'drag-over' : ''}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {!imagePreview && (
                  <span className="upload-text">Drag & Drop or Browse</span>
                )}
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>
          </div> 
          <button type="submit" className='addbook-button'>Add</button>
        </form>
    </div>
  );
};

export default AddBookForm;
