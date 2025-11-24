import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());

  const refreshCaptcha = () => setCaptcha(Math.random().toString(36).substring(2, 8).toUpperCase());

  return (
    <div className="hero-wrap">
      <div className="hero-panel">
        <div className="hero-left">
          <div className="headline">Welcome</div>
          <div className="sub">Sign in to start your secure, proctored exam session. Enter credentials and follow steps to proceed.</div>
          <div className="hero-decor" aria-hidden="true" />
        </div>

        <div className="hero-right">
          <div className="login-card">
            <Card elevated={true} className="p-4">
              <div style={{ textAlign: 'center', marginBottom: 10 }}>
                <h2 style={{ fontSize: 22, fontWeight: 600, color: '#1f2937' }}>Sign in</h2>
                <p style={{ color: '#6b7280', fontSize: 13 }}>Enter your credentials to access your exam</p>
              </div>

              <form onSubmit={handleSubmit} aria-label="login form">
                <div style={{ display: 'grid', gap: 12 }}>
                  {error && (
                    <div role="alert" aria-live="assertive" style={{ background: '#fff1f2', border: '1px solid #fecaca', padding: 8, borderRadius: 6 }}>
                      <p style={{ color: '#991b1b', fontSize: 13 }}>{error}</p>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="email-address" style={{ fontSize: 13, marginBottom: 6, color: '#374151' }}>User name</label>
                    <div className="input-with-icon">
                      <span className="icon"><svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" /></svg></span>
                      <input id="email-address" name="email" type="email" autoComplete="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="test@example.com" style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fafafa' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <label htmlFor="password" style={{ fontSize: 13, marginBottom: 6, color: '#374151' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <span className="icon" style={{ left: 10, position: 'absolute', top: '50%', transform: 'translateY(-50%)' }}><svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 8a5 5 0 1110 0v2h1a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6a1 1 0 011-1h1V8zm2 2V8a3 3 0 116 0v2H7z" clipRule="evenodd" /></svg></span>
                      <input id="password" name="password" type={showPassword? 'text':'password'} autoComplete="current-password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••" style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fafafa' }} />
                      <button type="button" onClick={()=>setShowPassword(s=>!s)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#6b7280' }}>{showPassword? 'Hide':'Show'}</button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ minWidth: 90, textAlign: 'center', background: '#fff0f6', border: '1px solid #fed7e2', padding: 8, borderRadius: 6, fontWeight: 700, color: '#be185d' }}>{captcha}</div>
                    <button type="button" onClick={refreshCaptcha} style={{ background: 'transparent', border: 'none', color: '#6b7280' }}>↻</button>
                    <input type="text" name="captcha" placeholder="Captcha Code" style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}><input type="checkbox" style={{ width: 16, height: 16 }} /><span style={{ fontSize: 13 }}>Remember Me</span></label>
                    <a href="#" style={{ color: '#2563eb' }}>Forgot Password</a>
                  </div>

                  <button type="submit" disabled={loading} style={{ width: '100%', background: '#10b981', color: 'white', padding: '10px 12px', borderRadius: 8, fontWeight: 600 }}>{loading ? 'Logging in...' : 'Login'}</button>
                  <div style={{ textAlign: 'center', marginTop: 8 }}>
                    <div style={{ marginTop: 10, fontSize: 13, color: '#6b7280' }}>
                      Don't have an account? <button type="button" onClick={()=>navigate('/register')} style={{ color: '#2563eb', background:'transparent', border:'none', cursor:'pointer', fontWeight:600 }}>Sign up</button>
                    </div>
                  </div>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;