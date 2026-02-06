import React from 'react';
import './Input.css';
const Input = ({ label, type = "text", placeholder, value, onChange, name, error }) => {
  return (
    <div className="input-group" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column' }}>
      {/* 1. The Label */}
      {label && <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>{label}</label>}
      
      {/* 2. The Input Field */}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="input" 
      />

      {/* 3. The Error Message */}
      {error && <span style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{error}</span>}
    </div>
  );
};

export default Input;