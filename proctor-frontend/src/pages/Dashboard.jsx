import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const profileRef = useRef(null);

  // --- Data loading from backend ---
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
      
      // Redirect based on user role
      if (userData.role === 'INSTRUCTOR') {
        navigate('/instructor-dashboard');
        return;
      } else if (userData.role === 'STUDENT') {
        navigate('/student-dashboard');
        return;
      }
    }

    // Fetch exams from backend
    const fetchExams = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/exams', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const examsData = await response.json();
          // Transform backend data to frontend format
          const transformedExams = examsData.map(exam => ({
            id: exam.id,
            title: exam.title,
            course: `Course ${exam.courseId || 'N/A'}`,
            startTime: exam.startTime || new Date().toISOString(),
            duration: exam.durationMin || 90,
            status: 'upcoming', // You can determine this based on startTime
            description: 'Exam description',
            instructor: 'Instructor'
          }));
          setExams(transformedExams);
        } else {
          // Fallback to mock data if API fails
          setExams([
            { id: 1, title: 'Mathematics Midterm', course: 'Math 101', startTime: new Date().toISOString(), duration: 90, status: 'upcoming', description: 'Comprehensive midterm covering chapters 1-5', instructor: 'Dr. Smith' }
          ]);
        }
      } catch (error) {
        console.error('Error fetching exams:', error);
        // Fallback to mock data
        setExams([
          { id: 1, title: 'Mathematics Midterm', course: 'Math 101', startTime: new Date().toISOString(), duration: 90, status: 'upcoming', description: 'Comprehensive midterm covering chapters 1-5', instructor: 'Dr. Smith' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [navigate]);

  // --- Close profile menu on outside click or Escape ---
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    const onKey = (e) => { if (e.key === 'Escape') setProfileMenuOpen(false); };

    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // --- Helpers ---
  const handleStartExam = useCallback((examId) => {
    navigate(`/exam/${examId}`);
  }, [navigate]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'upcoming': return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Upcoming</span>;
      case 'completed': return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
      case 'in-progress': return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
      default: return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'border-l-4 border-blue-500';
      case 'completed': return 'border-l-4 border-green-500';
      case 'in-progress': return 'border-l-4 border-yellow-500';
      default: return 'border-l-4 border-gray-500';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-50';
      case 'completed': return 'bg-green-50';
      case 'in-progress': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const calculateProgress = (status, score) => {
    if (status === 'completed') return 100;
    if (status === 'in-progress') return 65;
    return 0;
  };

  // --- Memoized counts to avoid re-calculations on every render ---
  const counts = useMemo(() => ({
    upcoming: exams.filter(e => e.status === 'upcoming').length,
    completed: exams.filter(e => e.status === 'completed').length,
    inProgress: exams.filter(e => e.status === 'in-progress').length,
    total: exams.length
  }), [exams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-700 text-lg">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-indigo-800 to-indigo-900 text-white transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0 shadow-xl`} aria-label="Sidebar">
        <div className="flex items-center justify-between h-16 px-4 border-b border-indigo-700">
          <div className="flex items-center">
            <div className="bg-white rounded-lg p-1 mr-3">
              <div className="bg-indigo-600 rounded w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
            </div>
            <span className="text-xl font-bold">ProctorPortal</span>
          </div>

          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-300 hover:text-white text-2xl font-bold" aria-label="Close sidebar">
            ×
          </button>
        </div>

        <nav className="mt-5 px-2" aria-label="Main navigation">
          <button className="flex items-center w-full px-4 py-3 text-white bg-indigo-700 rounded-lg font-medium">
            <span className="mr-3">📊</span>
            Dashboard
          </button>

          <button className="flex items-center w-full px-4 py-3 mt-1 text-indigo-200 hover:bg-indigo-700 rounded-lg font-medium">
            <span className="mr-3">📝</span>
            My Exams
          </button>
          <button className="flex items-center w-full px-4 py-3 mt-1 text-indigo-200 hover:bg-indigo-700 rounded-lg font-medium">
            <span className="mr-3">📈</span>
            Results
          </button>
          <button className="flex items-center w-full px-4 py-3 mt-1 text-indigo-200 hover:bg-indigo-700 rounded-lg font-medium">
            <span className="mr-3">⚙️</span>
            Settings
          </button>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-700">
          <div className="flex items-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
            <div className="ml-3">
              <p className="text-sm font-medium text-white">{user?.name}</p>
              <p className="text-xs text-indigo-300">Student</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden" role="main">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 mr-3 text-2xl" aria-label="Open sidebar">
                ☰
              </button>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none mr-2" aria-label="Notifications">
                <span className="text-xl">🔔</span>
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(prev => !prev)}
                  className="flex items-center max-w-xs rounded-full focus:outline-none"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
                  <span className="ml-1 text-xs text-gray-500 hidden md:block">▼</span>
                </button>

                {profileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-label="Profile options">
                    <div className="py-1">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</button>
                      <button
                        onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-gray-600">Here's what's happening with your exams today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white overflow-hidden shadow rounded-xl transform transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <span className="text-blue-600 text-xl">📅</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Exams</dt>
                      <dd className="flex items-baseline">
                        <div className="text-3xl font-bold text-gray-900">{counts.upcoming}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-xl transform transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                      <dd className="flex items-baseline">
                        <div className="text-3xl font-bold text-gray-900">{counts.completed}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-xl transform transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                    <span className="text-yellow-600 text-xl">⏳</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">In Progress</dt>
                      <dd className="flex items-baseline">
                        <div className="text-3xl font-bold text-gray-900">{counts.inProgress}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-xl transform transition-all duration-300 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                    <span className="text-purple-600 text-xl">📚</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Exams</dt>
                      <dd className="flex items-baseline">
                        <div className="text-3xl font-bold text-gray-900">{counts.total}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exams section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Exams</h2>
            <div className="flex mt-4 sm:mt-0 space-x-3">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm">
                <span className="mr-2">📤</span>
                Export
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <span className="mr-2">➕</span>
                New Exam
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          {exams.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow">
              <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No exams</h3>
              <p className="mt-1 text-gray-500">Get started by creating a new exam.</p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="mr-2">➕</span>
                  New Exam
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => {
                const formattedDateTime = formatDateTime(exam.startTime);
                const progress = calculateProgress(exam.status, exam.score);

                return (
                  <div
                    key={exam.id}
                    className={`bg-white overflow-hidden shadow rounded-xl transform transition-all duration-300 hover:shadow-lg ${getStatusColor(exam.status)}`}
                  >
                    <div className={`px-6 py-5 ${getStatusBgColor(exam.status)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{exam.title}</h3>
                          <p className="mt-1 text-sm text-indigo-600 font-medium">{exam.course}</p>
                        </div>
                        {getStatusBadge(exam.status)}
                      </div>

                      <p className="mt-4 text-gray-600 line-clamp-2">
                        {exam.description}
                      </p>

                      <div className="mt-6 space-y-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-3">👨‍🏫</span>
                          <span>{exam.instructor}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-3">📅</span>
                          <div>
                            <span className="block font-medium">{formattedDateTime.date}</span>
                            <span className="block text-xs">{formattedDateTime.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="mr-3">⏱️</span>
                          <span>{exam.duration} minutes</span>
                        </div>

                        {exam.status === 'completed' && exam.score && (
                          <div className="pt-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Score</span>
                              <span className="font-bold text-green-600">{exam.score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-green-600 h-2.5 rounded-full"
                                style={{ width: `${exam.score}%` }}
                              ></div>
                            </div>
                          </div>
                        )}

                        {exam.status === 'in-progress' && (
                          <div className="pt-2">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progress</span>
                              <span className="font-bold text-yellow-600">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-yellow-500 h-2.5 rounded-full"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        {exam.status === 'upcoming' ? (
                          <button
                            onClick={() => handleStartExam(exam.id)}
                            aria-label={`Start exam ${exam.title}`}
                            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Start Exam
                          </button>
                        ) : exam.status === 'completed' ? (
                          <button
                            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            aria-label={`View results for ${exam.title}`}
                          >
                            View Results
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartExam(exam.id)}
                            aria-label={`Continue exam ${exam.title}`}
                            className="w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                          >
                            Continue Exam
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar overlay"
          role="button"
          tabIndex="0"
        ></div>
      )}
    </div>
  );
};

export default Dashboard;