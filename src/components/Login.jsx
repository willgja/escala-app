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
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Acesso Seguro</h2>
          <p className="login-subtitle">Gestão de Escalas Premium</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input 
              type="text" 
              placeholder="Digite seu usuário" 
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Sua senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-login">Entrar no painel</button>
        </form>
      </div>
    </div>
  );
}
