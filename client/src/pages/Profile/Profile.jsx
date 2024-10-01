import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';

const UpdateProfile = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const userResponse = await axios.get('http://localhost:3000/users/profile', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setFormData(userResponse.data);
      } catch (error) {
        handleAuthError(error);
        console.error('Error fetching user profile:', error.message);
      }

      try {
        const transactionsResponse = await axios.get('http://localhost:3000/transactions/recent-transactions', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        setTransactions(transactionsResponse.data);
      } catch (error) {
        handleAuthError(error);
        console.error('Error fetching recent transactions:', error.message);
      }
    };

    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contactDetails: '',
    state: '',
    city: '',
    pincode: '',
    nearbyLocation: '',
    houseNo: '',
    wallet: 0
  });
  const [isEditing, setIsEditing] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:3000/users/profile', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      setIsEditing(false);
    } catch (error) {
      handleAuthError(error);
      console.error('Error updating profile:', error.message);
    }
  };

  const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate('/auth');
    }
  };

  return (
    <div className="profile-container">
      <div className="recent-transactions">
        <div className='add-book'>
          <h2>Want to sell your book?</h2>
          <button onClick={() => navigate('/addbook')}>Add Book</button>
        </div>
        <div className='recent-box'>
          <h3>Recent Transactions</h3>
          <ul className="transaction-list">
            {transactions.map(transaction => (
              <li key={transaction._id} className="transaction-card">
                <div className="transaction-details">
                  <p>Transaction ID: {transaction._id}</p>
                  <p>
                    Transaction status: 
                    <span className={
                      transaction.status === 'completed' ? 'completed' :
                      transaction.status === 'pending' ? 'pending' : 'failed'
                    }>
                      &nbsp;{transaction.status}
                    </span>
                  </p>
                  <p>
                    You are{' '}
                    <span className={formData._id === transaction.buyer ? 'buyer' : 'seller'}>
                      {formData._id === transaction.buyer ? 'Buyer' : 'Seller'}
                    </span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="update-profile">
        <div className="user-wallet">
          <h3>Wallet</h3>
          <p>Balance: {formData.wallet}</p>
        </div>
        <div className='profile-box'>
          <h2>Update Profile - Booky</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label>Contact Details:</label>
              <input
                type="text"
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label>House No:</label>
              <input
                type="text"
                name="houseNo"
                value={formData.houseNo}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? 'disabled-input' : ''}
              />
            </div>
            <div>
              <label>Nearby Location:</label>
              <input
                type="text"
                name="nearbyLocation"
                value={formData.nearbyLocation}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? 'disabled-input' : ''}
              />
            </div>
            <div>
              <label>City:</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? 'disabled-input' : ''}
              />
            </div>
            <div>
              <label>State:</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? 'disabled-input' : ''}
              />
            </div>
            <div>
              <label>Pincode:</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? 'disabled-input' : ''}
              />
            </div>
            {!isEditing && (
              <button type="button" onClick={handleUpdateClick}>Update</button>
            )}
            {isEditing && (
              <button type="submit">Save Changes</button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
