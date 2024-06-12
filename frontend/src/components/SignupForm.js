// SignupForm.js
import React from 'react';

const SignupForm = ({ onClose }) => {
  return (
    <div className="form-container">
      <div className="signup-form">
        <span className="close-icon" onClick={onClose}>&times;</span>
        <h2>Signup</h2>
        <form>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" placeholder="Your Name" />
          </div>
          <div className="form-group">
            <label htmlFor="signupId">ID</label>
            <input type="text" id="signupId" name="signupId" placeholder="Choose ID" />
          </div>
          <div className="form-group">
            <label htmlFor="signupPassword">Password</label>
            <input type="password" id="signupPassword" name="signupPassword" placeholder="Choose Password" />
          </div>
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input type="text" id="mobile" name="mobile" placeholder="Your Mobile Number" />
          </div>
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
}

export default SignupForm;
