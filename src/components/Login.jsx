import React, { useState } from 'react';
import './Login.css';

import { api } from '../api';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      try {
        const res = await api.post('/login', { username, password });
        localStorage.setItem('token', res.data.token);
        onLogin();
      } catch (err) {
        alert("Credenciais inválidas");
      }
    } else {
      alert("Please enter a username and password.");
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-banner"></div>
        <div className="login-form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="login-input-group">
              <svg className="login-icon" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              <input 
                type="text" 
                className="login-input" 
                placeholder="Username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            
            <div className="login-input-group">
              <svg className="login-icon" viewBox="0 0 24 24">
                 <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
              </svg>
              <input 
                type="password" 
                className="login-input" 
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="login-options">
              <div className="remember-me" onClick={() => setRemember(!remember)}>
                <div className={`toggle-switch ${remember ? 'active' : ''}`}></div>
                <span>remember me</span>
              </div>
              <a href="#" className="forgot-pw">forgot password</a>
            </div>

            <button type="submit" className="btn-login-main">Login</button>
            <div className="create-account">Create Account</div>
          </form>
        </div>
      </div>
    </div>
  );
}
