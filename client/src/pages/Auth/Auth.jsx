import React, { useState } from 'react';
import LoginForm from '../../components/Login/Login';
import SignupForm from '../../components/SignUp/SignUp';
import './Auth.css'; 

const AuthPage = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const toggleForm = () => {
    setIsLoginForm(prevState => !prevState);
  };

  return (
    <div className="auth-container">
      <div className="auth-title">
        Welcome to BookVerse
      </div>
      <div className="auth-form-container">
        {isLoginForm ? <LoginForm toggleForm={toggleForm} /> : <SignupForm toggleForm={toggleForm} setIsLoginForm={setIsLoginForm} />}
      </div>
    </div>
  );
};

export default AuthPage;
