import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMessage(data.message || 'Password reset successful');
        setTimeout(()=>navigate('/login'),1500);
      } else {
        setMessage(data || 'Reset failed');
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
        <h2 className="text-2xl font-semibold mb-2">Reset Password</h2>
        <p className="text-sm text-gray-600 mb-4">Paste the reset token you received and choose a new password.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
            <input value={token} onChange={(e)=>setToken(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">{loading? 'Resetting...':'Reset Password'}</button>
          </div>
        </form>

        {message && <div className="mt-4 text-sm text-green-700">{message}</div>}
      </div>
    </div>
  );
};

export default ResetPassword;
