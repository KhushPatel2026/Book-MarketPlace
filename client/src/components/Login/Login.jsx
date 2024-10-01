import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom';
import './Login.css'

const LoginForm = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
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
      const response = await axios.post('http://localhost:3000/auth/login', formData); // Use Axios for POST request
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        setError(response.data.error || 'Login failed');
        navigate('/register');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred');
    }
  };

  return (
    <div className='login-container'>
      <h2 className='login-heading'>Login</h2>
      <form onSubmit={handleSubmit} className='login-form'>
        <div>
          <label htmlFor="email" className='login-label'>Email:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className='login-input'/>
          <label htmlFor="password" className='login-label'>Password:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required className='login-input'/>
        </div>
        <div>
          <button type="submit" className='login-button'>Login</button>
        </div>
      </form>
      {error && <p className='login-error'>{error}</p>}
      <p className='login-signup-link'>Don't have an account? <button onClick={toggleForm} className='login-signup-button'>Signup</button></p>
    </div>
  );
};

export default LoginForm;