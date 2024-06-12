// Navbar.js
import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleCloseForms = () => {
    setShowLogin(false);
    setShowSignup(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains('modal')) {
      handleCloseForms();
    }
  };

  useEffect(() => {
    if (showLogin || showSignup) {
      document.addEventListener('click', handleOutsideClick);
    } else {
      document.removeEventListener('click', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showLogin, showSignup]);

  return (
    <div className="navbar">
      <h1 className="navbar-heading">AZETTA WEB-GIS</h1>
      <div className="buttons">
        <button onClick={handleLoginClick}>Login</button>
        <button onClick={handleSignupClick}>Signup</button>
      </div>
      {showLogin && (
        <div className="modal">
          <div className="modal-content">
            <LoginForm onClose={handleCloseForms} />
          </div>
        </div>
      )}
      {showSignup && (
        <div className="modal">
          <div className="modal-content">
            <SignupForm onClose={handleCloseForms} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
