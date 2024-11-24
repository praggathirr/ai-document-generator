import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const CreateAccount = ({ setUsername }) => {
  const [inputUsername, setInputUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateAccount = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/create-account`, {
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
        setError('Username already exists. Please choose a different one.');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('An error occurred while creating the account.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <input
        type="text"
        placeholder="Enter a unique username"
        value={inputUsername}
        onChange={(e) => setInputUsername(e.target.value)}
      />
      <button onClick={handleCreateAccount} className="auth-button">Create Account</button>
      {error && <p className="error-message">{error}</p>}
      <button onClick={() => navigate('/sign-in')} className="link-button">Already have an account? Sign In</button>
    </div>
  );
};

export default CreateAccount;
