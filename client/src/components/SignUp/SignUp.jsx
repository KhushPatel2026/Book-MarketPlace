// SignUp.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SignUp.css';

const SignupForm = ({ toggleForm, setIsLoginForm }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/register', formData);
      if (response.status === 201) {
        setIsLoginForm(true);
        navigate('/auth');
      } else {
        const data = response.data;
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred');
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-heading">Signup</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div>
          <label htmlFor="username" className="signup-label">Username:</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required className="signup-input" placeholder='Username'/>
          <label htmlFor="email" className="signup-label">Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="signup-input" placeholder='Email'/>
          <label htmlFor="password" className="signup-label">Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className="signup-input" placeholder='Password'/>
        </div>
        <div>
          <button type="submit" className="signup-button">Signup</button>
        </div>
      </form>
      {error && <p className="signup-error">{error}</p>}
      <p className="signup-login-link">Already have an account? <button onClick={toggleForm} className="signup-login-button">Login</button></p>
    </div>
  );
};

export default SignupForm;
