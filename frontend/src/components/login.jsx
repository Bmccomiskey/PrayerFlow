import React, { useState } from 'react';
// import { login } from '../services/api'; // Example import for when you implement it

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- TODO: Implement API call ---
    // try {
    //   const data = await login({ email, password });
    //   localStorage.setItem('authToken', data.access_token);
    //   onLoginSuccess();
    // } catch (err) {
    //   setError('Failed to log in. Please check your credentials.');
    // }

    // --- Placeholder logic for demonstration ---
    if (email === 'pastor@church.com' && password === 'password') {
      console.log('Login successful (placeholder)');
      onLoginSuccess();
    } else {
      setError('Invalid credentials (use pastor@church.com / password)');
    }
  };

  return (
    <div className="login-container">
      <h2>PrayerFlow Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;
