// Navbar.js
import React, { useState } from 'react';
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

  return (
    <div className="navbar">
      <h1 className="navbar-heading">AZETTA WEB-GIS</h1>
      <div className="buttons">
        <button onClick={handleLoginClick}>Login</button>
        <button onClick={handleSignupClick}>Signup</button>
      </div>
      {showLogin && <LoginForm onClose={handleCloseForms} />}
      {showSignup && <SignupForm onClose={handleCloseForms} />}
    </div>
  );
}

export default Navbar;
