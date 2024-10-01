import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './CheckOutPage.css';

const CheckoutPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [deliveryMethod, setDeliveryMethod] = useState('self-pickup');
  const [rentDays, setRentDays] = useState(0);
  const [purchaseOption, setPurchaseOption] = useState('buy');
  const { book } = location.state;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) {
      navigate('/auth');
    } else {
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
          navigate('/auth');
        });
    }
  }, [navigate]);

  const handleDeliveryMethodChange = event => {
    setDeliveryMethod(event.target.value);
  };

  const handleRentDaysChange = event => {
    setRentDays(event.target.value);
  };

  const handlePurchaseOptionChange = event => {
    setPurchaseOption(event.target.value);
  };

  const handlePay = async () => {
    const totalPrice = calculateTotal();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      const response = await axios.post(
        'http://localhost:3000/transactions/create-checkout-session',
        {
          book,
          totalPrice,
          purchaseOption,
          deliveryMethod,
          rentDays
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );
      localStorage.setItem('sessionId', response.data.id);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      navigate('/auth');
    }
  };

  const calculateTotal = () => {
    // Calculate total including delivery charges and convenience fee
    let deliveryCharges = 0;
    if (deliveryMethod === 'delivery-services') {
      deliveryCharges = 40;
    } else if (deliveryMethod === 'mailing') {
      deliveryCharges = 20;
    }

    const convenienceFee = 20;
    const bookPrice =
      purchaseOption === 'rent'
        ? parseInt(book.rentPrice) * rentDays
        : parseInt(book.buyPrice);
    const total = bookPrice + deliveryCharges + convenienceFee;
    return total;
  };

  return (
    <div className='overall-page'>
      <div className="container-cp">
        <h2>Checkout</h2>
        <div className='top'>
          <div className='top-1'>
            <div className='image-box-1'>
              <img src={book.image} alt={book.title} className='checkout-image'/>
            </div>
            <div className='details'>
              <p className='checkout-p'>Title: {book.title}</p>
              <p className='checkout-p'>Author: {book.author}</p>
              <p className='checkout-p'>Seller: {book.owner.username}</p>
            </div>
          </div>
          
          <div className='purchase-option'>
            <h3>Purchase Option</h3>
            <div>
              <input
                type="radio"
                id="buy"
                name="purchaseOption"
                value="buy"
                checked={purchaseOption === 'buy'}
                onChange={handlePurchaseOptionChange}
              />
              <label htmlFor="buy">Buy</label>
            </div>
            <div>
              <input
                type="radio"
                id="rent"
                name="purchaseOption"
                value="rent"
                checked={purchaseOption === 'rent'}
                onChange={handlePurchaseOptionChange}
              />
              <label htmlFor="rent">Rent</label>
            </div>
            {purchaseOption === 'rent' && (
            <div>
              <h3>Rent Duration</h3>
              <input
                type="number"
                value={rentDays}
                onChange={handleRentDaysChange}
                max={28}
                min={1}
              />
              <label htmlFor="rentDays">days</label>
            </div>
            )}
          </div>
        </div>
        <div className='bottom'>
          <div className='bottom-1'>
            <div>
              <input
                type="radio"
                id="self-pickup"
                name="deliveryMethod"
                value="self-pickup"
                checked={deliveryMethod === 'self-pickup'}
                onChange={handleDeliveryMethodChange}
              />
              <label htmlFor="Self-pickup">Self-pickup (₹0 charges)</label>
              <p>
                <span>&nbsp;&nbsp;&nbsp;</span>{currentUser && `${book.owner.houseNo}, ${book.owner.nearbyLocation}, ${book.owner.city}, ${book.owner.state}, ${book.owner.pincode}`}
              </p>
            </div>
            <div>
              <input
                type="radio"
                id="delivery-services"
                name="deliveryMethod"
                value="delivery-services"
                checked={deliveryMethod === 'delivery-services'}
                onChange={handleDeliveryMethodChange}
              />
              <label htmlFor="Delivery">Delivery Services (₹40 charges)</label>
              <p>
              <span>&nbsp;&nbsp;&nbsp;</span>{currentUser && `${currentUser.houseNo}, ${currentUser.nearbyLocation}, ${currentUser.city}, ${currentUser.state}, ${currentUser.pincode}`}
              </p>
              <p><span>&nbsp;&nbsp;&nbsp;</span>Estimated time: 2-3 days</p>
            </div>
            <div>
              <input
                type="radio"
                id="mailing"
                name="deliveryMethod"
                value="mailing"
                checked={deliveryMethod === 'mailing'}
                onChange={handleDeliveryMethodChange}
              />
              <label htmlFor="Mailing">Mailing (₹20 charges)</label>
              <p>
              <span>&nbsp;&nbsp;&nbsp;</span>{currentUser && `${currentUser.houseNo}, ${currentUser.nearbyLocation}, ${currentUser.city}, ${currentUser.state}, ${currentUser.pincode}`}
              </p>
              <p><span>&nbsp;&nbsp;&nbsp;</span>Estimated time: 10-12 days</p>
            </div>
          </div>
          <div className='bottom-2'>
            <h3>Summary</h3>
            <p>Book Price: ₹{purchaseOption === 'rent' ? parseInt(book.rentPrice) * rentDays : parseInt(book.buyPrice)}</p>
            <p>Delivery Charges: ₹{deliveryMethod === 'delivery-services' ? 40 : deliveryMethod === 'mailing' ? 20 : 0}</p>
            <p>Convenience Fee: ₹20</p>
            <p>Total: ₹{calculateTotal()}</p>
          </div>
        </div>
        <button className='cp-button' onClick={handlePay}>Pay ₹{calculateTotal()}</button>
      </div>
    </div>
  );
};

export default CheckoutPage;
