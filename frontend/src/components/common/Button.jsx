
import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = "button", variant = "primary", disabled = false }) => {
  return (
    <button
      type={type}
      className={`custom-btn ${variant}`} // Combines the base style with a variant (primary)
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;