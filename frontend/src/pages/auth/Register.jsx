import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
  // 1. State for all registration fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();

    // Basic validation check
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Registering User:", { fullName, email, password });
    // This is where your API call to create a user will go later
  };

  return (
    <div style={{ padding: '40px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ marginBottom: '2rem' }}>Create Account</h1>
      
      <form onSubmit={handleRegister}>
        <Input 
          label="Full Name" 
          placeholder="John Doe" 
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <Input 
          label="Email" 
          type="email"
          placeholder="example@mail.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input 
          label="Password" 
          type="password"
          placeholder="Create a password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Input 
          label="Confirm Password" 
          type="password"
          placeholder="Repeat your password" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <Button type="submit">
          Register
        </Button>
      </form>

      <p style={{ marginTop: '25px', fontSize: '14px', color: '#666' }}>
        Already have an account? 
        <Link to="/Login" style={{ color: '#646cff', fontWeight: 'bold' }}>
            Log in here
        </Link>
      </p>
    </div>
  );
};

export default Register;