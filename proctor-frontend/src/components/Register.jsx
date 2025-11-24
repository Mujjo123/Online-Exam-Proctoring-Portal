import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [regPhoto, setRegPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Create user object
      const userData = {
        name,
        email,
        passwordHash: password,
        role
      };

      // Only add regPhotoUrl if a photo is selected
      if (regPhoto) {
        // For mock purposes, we'll just send a placeholder
        userData.regPhotoUrl = 'placeholder-photo-url';
      }

      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #f0f4ff, #e6f0ff)', padding: '2rem' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1a202c' }}>
            Create your account
          </h2>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#718096' }}>
            Secure online exam proctoring system
          </p>
        </div>
        <form style={{ marginTop: '2rem' }} onSubmit={handleSubmit}>
          {error && (
            <div style={{ backgroundColor: '#fff5f5', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ flexShrink: 0 }}>
                  <span style={{ color: '#e53e3e' }}>⚠</span>
                </div>
                <div style={{ marginLeft: '0.75rem' }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#c53030' }}>{error}</h3>
                </div>
              </div>
            </div>
          )}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.25rem' }}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#1a202c' }}
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email-address" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.25rem' }}>
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#1a202c' }}
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.25rem' }}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#1a202c' }}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="role" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.25rem' }}>
              Role
            </label>
            <select
              id="role"
              name="role"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#1a202c' }}
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="STUDENT">Student</option>
              <option value="INSTRUCTOR">Instructor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reg-photo" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568', marginBottom: '0.25rem' }}>
              Registration Photo (Optional)
            </label>
            <input
              id="reg-photo"
              name="regPhoto"
              type="file"
              accept="image/*"
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.375rem', color: '#1a202c' }}
              onChange={(e) => setRegPhoto(e.target.files[0])}
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', backgroundColor: '#5a67d8', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', fontWeight: '500', border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>
        </form>
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.875rem', color: '#718096' }}>
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')} 
            style={{ color: '#5a67d8', background: 'none', border: 'none', cursor: 'pointer', fontWeight: '500' }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;