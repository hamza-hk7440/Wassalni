import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Login = () => {
  // 1. Initialize the state for Email and Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. This function runs when the user clicks the "Sign In" button
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevents the page from refreshing
    
    // For now, we just log the data to the console
    console.log("Form Submitted!");
    console.log("Email:", email);
    console.log("Password:", password);

    // Later, you will add your fetch() or axios call here to talk to your backend
  };

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '400px', 
      margin: '0 auto', 
      textAlign: 'center' 
    }}>
      <h1 style={{ marginBottom: '2rem' }}>Login</h1>
      
      <form onSubmit={handleSubmit}>
        {/* 3. Connect the Input value and onChange to our state */}
        <Input 
          label="Email" 
          placeholder="Enter your email" 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input 
          label="Password" 
          placeholder="Enter your password" 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit">
          Sign In
        </Button>
      </form>

      {/* 4. Navigation Link */}
      <p style={{ marginTop: '25px', fontSize: '14px', color: '#666' }}>
        Don't have an account? 
        <Link to="/register" style={{ color: '#646cff', fontWeight: 'bold' }}>
            Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;