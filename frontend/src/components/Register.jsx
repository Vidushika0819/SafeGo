import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { username, email, password, role });
      alert('Registered! Login now.');
      window.location.href = '/';
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFFFFF', color: '#2F4F4F', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ color: '#1E90FF' }}>Register</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        />
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
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ padding: '8px', border: '1px solid #1E90FF', borderRadius: '4px' }}
        >
          <option value="driver">Driver</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={{ padding: '10px', backgroundColor: '#FFD700', color: '#2F4F4F', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;