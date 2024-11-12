import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const SignIn = ({ setUsername }) => {
  const [inputUsername, setInputUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      const response = await fetch('http://localhost:5001/sign-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: inputUsername }),
      });
      const data = await response.json();
      if (data.success) {
        setUsername(inputUsername);
        navigate('/overview');
      } else {
        setError('Username not found. Please check your username or create a new account.');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      setError('An error occurred while signing in.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <input
        type="text"
        placeholder="Enter your username"
        value={inputUsername}
        onChange={(e) => setInputUsername(e.target.value)}
      />
      <button onClick={handleSignIn} className="auth-button">Sign In</button>
      {error && <p className="error-message">{error}</p>}
      <button onClick={() => navigate('/create-account')} className="link-button">Don't have an account? Create Account</button>
    </div>
  );
};

export default SignIn;
