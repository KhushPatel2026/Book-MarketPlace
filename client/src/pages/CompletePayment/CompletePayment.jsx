import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import "./CompletePayment.css";

const CompletePaymentPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token === null) {
      navigate('/login');
    }
  }, [navigate]);
  const [paymentResult, setPaymentResult] = useState(null);
  const [status, setStatus] = useState("loading"); 

  useEffect(() => {
    const completePayment = async () => {
      const checkoutSessionId = localStorage.getItem('sessionId');
      if (!checkoutSessionId) {
        setStatus("failed"); 
        return;
      }
      
      try {
        const response = await axios.post('http://localhost:3000/transactions/complete-payment', {
          checkout_session_id: checkoutSessionId,
        });
        setPaymentResult(response.data);
        setStatus(response.data.error ? "failed" : "success"); 
      } catch (error) {
        console.error('Error completing payment:', error);
        setStatus("failed"); 
      }
    };
    completePayment();
  }, [navigate]);

  return (
    <div className='cpp-box'>
      <div className='cpp-container'>
        {status === "loading" && <p>Please wait while we complete your payment...</p>}
        {status === "success" && (
          <div className='cpp-box-1'>
            <h2 style={{ color: 'green' }}><FaCheck style={{ color: 'green', marginLeft: '5px' }} />Payment Successful </h2>
            <p>Payment ID: {paymentResult?.transactions?._id}</p>
            <Link to="/">Go to home</Link>
          </div>
        )}
        {status === "failed" && (
          <div className='cpp-box-1'>
            <h2 style={{ color: 'red' }}><ImCross style={{ color: 'red', marginLeft: '5px' }} />Payment Failed </h2>
            <p>There was an error processing your payment. Please try again later.</p>
            <Link to="/">Go to home</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletePaymentPage;
