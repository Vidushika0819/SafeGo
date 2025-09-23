import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      window.location.href = '/vehicles';
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', color: '#2F4F4F', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#1E90FF' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#FFD700', color: '#2F4F4F', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Login
        </button>
        <a href="/register" style={{ color: '#1E90FF', textDecoration: 'none' }}>Register</a>
      </form>
    </div>
  );
};

export default Login;