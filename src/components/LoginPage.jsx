import React, { useState } from 'react';
import { Logo } from './Logo';
import { Notif } from './Notif';
import { authAPI } from '../services/api';

export const LoginPage = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await authAPI.login(username, password);
      console.log('✅ Login success:', data);
      
      // Call loginHandler with token, isAdmin flag, and username
      props.loginHandler(data.token, data.isAdmin, username);
      props.setNotif({ message: 'Login successful!', style: 'success' });
    } catch (error) {
      console.error('❌ Login error:', error);
      const message = error.message || 'Invalid username or password';
      props.setNotif({ message, style: 'danger' });
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="login-page">
      <div id="login">
        <Logo />
        <Notif message={props.notif.message} style={props.notif.style} />

        <form onSubmit={onSubmitHandler}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            placeholder="Enter username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter password"
            required
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            className="btn secondary"
            style={{ marginTop: '10px', backgroundColor: '#ddd', color: '#333' }}
            onClick={() => props.setIsSignUp(true)}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
