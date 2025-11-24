import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const [examSessions, setExamSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
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
      
      // Only show instructor dashboard if user is instructor
      if (userData.role !== 'INSTRUCTOR' && userData.role !== 'ADMIN') {
        navigate('/dashboard');
        return;
      }
    }

    fetchExamSessions();
  }, [navigate]);

  const fetchExamSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/exam-sessions`, {
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

  const fetchEventLogs = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/event-logs/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const events = await response.json();
        return events;
      }
    } catch (error) {
      console.error('Error fetching event logs:', error);
    }
    return [];
  };

  const handleViewSession = async (session) => {
    const events = await fetchEventLogs(session.id);
    setSelectedSession({ ...session, events });
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

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
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
        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <span className="text-white text-xl">📊</span>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sessions</dt>
                    <dd className="text-2xl font-bold text-gray-900">{examSessions.length}</dd>
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
                    <dt className="text-sm font-medium text-gray-500 truncate">Flagged Sessions</dt>
                    <dd className="text-2xl font-bold text-gray-900">
                      {examSessions.filter(s => s.suspicionScore > 70).length}
                    </dd>
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
        </div>

        {/* Exam Sessions Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Exam Sessions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Suspicion Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {examSessions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No exam sessions found
                    </td>
                  </tr>
                ) : (
                  examSessions.map((session) => (
                    <tr key={session.id} className={session.suspicionScore > 70 ? 'bg-red-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{session.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.examId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {session.userId}
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewSession(session)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Session Details Modal */}
        {selectedSession && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Session #{selectedSession.id} Details</h3>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Exam ID:</p>
                    <p className="text-sm text-gray-900">{selectedSession.examId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">User ID:</p>
                    <p className="text-sm text-gray-900">{selectedSession.userId}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status:</p>
                    <p className="text-sm text-gray-900">{selectedSession.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Start Time:</p>
                    <p className="text-sm text-gray-900">
                      {selectedSession.startTime ? new Date(selectedSession.startTime).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  {selectedSession.endTime && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">End Time:</p>
                      <p className="text-sm text-gray-900">
                        {new Date(selectedSession.endTime).toLocaleString()}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-500">Suspicion Score:</p>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-3 mr-2">
                        <div 
                          className={`h-3 rounded-full ${
                            selectedSession.suspicionScore < 30 ? 'bg-green-500' : 
                            selectedSession.suspicionScore < 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${selectedSession.suspicionScore || 0}%` }}
                        ></div>
                      </div>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSuspicionColor(selectedSession.suspicionScore || 0)}`}>
                        {selectedSession.suspicionScore || 0} ({getSuspicionLabel(selectedSession.suspicionScore || 0)})
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Event Logs:</p>
                  <div className="max-h-64 overflow-y-auto border rounded-md p-4">
                    {selectedSession.events && selectedSession.events.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedSession.events.map((event, index) => (
                          <li key={index} className="text-sm border-b pb-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{event.eventType.replace('_', ' ')}</span>
                              <span className={`text-xs px-2 py-1 rounded-full ${getSeverityBadge(event.severity)}`}>
                                {event.severity}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'N/A'}
                            </div>
                            {event.detailJson && (
                              <div className="text-xs text-gray-500 mt-1">
                                {event.detailJson}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">No events logged</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;

