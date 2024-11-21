import React from 'react';
import { useLocation } from 'react-router-dom';
import './App.css';

const Header = ({ onLogout }) => {
  const location = useLocation();

  // Pages where the logout button is hidden
  const hiddenPages = ['/', '/sign-in', '/create-account'];

  // Check if the current page is in the hiddenPages list
  const hideLogout = hiddenPages.includes(location.pathname);

  return (
    <div className="header">
      {!hideLogout && (
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      )}
    </div>
  );
};

export default Header;
