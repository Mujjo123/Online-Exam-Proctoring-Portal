import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setToken('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(data.message || 'Check your email for reset instructions');
        if (data.token) setToken(data.token);
      } else {
        setMessage(data || 'Failed to send reset');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-4">Enter your account email and we'll send reset instructions.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>

          <div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded">{loading? 'Sending...':'Send reset'}</button>
          </div>
        </form>

        {message && <div className="mt-4 text-sm text-green-700">{message}</div>}
        {token && (
          <div className="mt-4 bg-gray-50 p-3 rounded text-sm">
            <div className="font-medium">Dev reset token (use in Reset page)</div>
            <div className="break-all">{token}</div>
            <div className="mt-2">
              <button onClick={()=>navigate('/reset')} className="text-indigo-600">Go to Reset</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
