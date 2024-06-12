// LoginForm.js
import React from 'react';

const LoginForm = ({ onClose }) => {
  return (
    <div className="form-container">
      <div className="login-form">
        <span className="close-icon" onClick={onClose}>&times;</span>
        <h2>Login</h2>
        <form>
          <div className="form-group">
            <label htmlFor="loginId">ID</label>
            <input type="text" id="loginId" name="loginId" placeholder="Your ID" />
          </div>
          <div className="form-group">
            <label htmlFor="loginPassword">Password</label>
            <input type="password" id="loginPassword" name="loginPassword" placeholder="Your Password" />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
