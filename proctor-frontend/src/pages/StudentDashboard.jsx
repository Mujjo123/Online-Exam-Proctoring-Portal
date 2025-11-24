import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [examSessions, setExamSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const BACKEND_URL = 'http://localhost:8080';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
    }

    fetchExamSessions();
  }, [navigate]);

  const fetchExamSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      
      const userData = JSON.parse(userStr);
      const response = await fetch(`${BACKEND_URL}/api/exam-sessions/user/${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const sessions = await response.json();
        setExamSessions(sessions);
      }
    } catch (error) {
      console.error('Error fetching exam sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuspicionColor = (score) => {
    if (score < 30) return 'text-green-600 bg-green-100';
    if (score < 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSuspicionLabel = (score) => {
    if (score < 30) return 'Low';
    if (score < 70) return 'Medium';
    return 'High';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
          <p className="text-gray-600">Here you can view your exam history and proctoring results.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <span className="text-white text-xl">📝</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Exams</dt>
                    <dd className="text-2xl font-bold text-gray-900">{examSessions.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <span className="text-white text-xl">✅</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {examSessions.filter(s => s.status === 'COMPLETED' || s.status === 'SUBMITTED').length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <span className="text-white text-xl">⚠️</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Flagged Exams</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {examSessions.filter(s => s.suspicionScore > 70).length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Sessions Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Your Exam History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suspicion Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {examSessions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No exam sessions found
                    </td>
                  </tr>
                ) : (
                  examSessions.map((session) => (
                    <tr key={session.id} className={session.suspicionScore > 70 ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Exam #{session.examId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          session.status === 'COMPLETED' || session.status === 'SUBMITTED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${
                                session.suspicionScore < 30 ? 'bg-green-500' : 
                                session.suspicionScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${session.suspicionScore || 0}%` }}
                            ></div>
                          </div>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSuspicionColor(session.suspicionScore || 0)}`}>
                            {session.suspicionScore || 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.startTime ? new Date(session.startTime).toLocaleString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.endTime ? new Date(session.endTime).toLocaleString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;