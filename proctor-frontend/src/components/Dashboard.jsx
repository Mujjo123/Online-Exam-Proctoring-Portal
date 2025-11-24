import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });
  const [loading] = useState(false);
  const [exams] = useState([
    {
      id: 1,
      title: 'Mathematics Midterm',
      course: 'Calculus II',
      description: 'Comprehensive exam covering derivatives and integrals',
      instructor: 'Dr. Sarah Williams',
      startTime: '2023-06-15T10:00:00Z',
      duration: 90,
      status: 'upcoming',
      score: null
    },
    {
      id: 2,
      title: 'Physics Final',
      course: 'Quantum Mechanics',
      description: 'Final examination covering all course material',
      instructor: 'Prof. Michael Chen',
      startTime: '2023-06-10T14:00:00Z',
      duration: 120,
      status: 'completed',
      score: 85
    },
    {
      id: 3,
      title: 'Chemistry Quiz',
      course: 'Organic Chemistry',
      description: 'Weekly quiz on reaction mechanisms',
      instructor: 'Dr. Emily Rodriguez',
      startTime: '2023-06-12T09:00:00Z',
      duration: 45,
      status: 'in-progress',
      score: null
    },
    {
      id: 4,
      title: 'Biology Exam',
      course: 'Cell Biology',
      description: 'Midterm exam on cellular processes',
      instructor: 'Prof. David Kim',
      startTime: '2023-06-18T11:00:00Z',
      duration: 75,
      status: 'upcoming',
      score: null
    }
  ]);

  const profileRef = useRef(null);

  // Close profile menu when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // --- Helpers ---
  const handleStartExam = useCallback((examId) => {
    navigate(`/exam/${examId}/lobby`);
  }, [navigate]);

  // Handler for sidebar navigation
  const handleSidebarNavigation = (path) => {
    // Navigate to the specified path
    navigate(path);
  };

  // Handler for profile menu items
  const handleProfileMenuItemClick = (item) => {
    switch (item) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'signout':
        localStorage.removeItem('token');
        navigate('/login');
        break;
      default:
        break;
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600" />
        <span className="ml-3 text-gray-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-purple-700 to-blue-800 text-white transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0`} aria-label="Sidebar">
        <div className="flex items-center justify-between h-16 px-4 border-b border-purple-600">
          <div className="flex items-center">
            {/* Logo container */}
            <div className="bg-white p-1 rounded-lg h-10 w-10 flex items-center justify-center overflow-hidden">
              <svg className="h-8 w-8 text-purple-600 max-w-full max-h-full" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="ml-3 text-xl font-bold">ProctorPortal</span>
          </div>

          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-300 hover:text-white" aria-label="Close sidebar">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="mt-5 px-2" aria-label="Main navigation">
          <button 
            className="flex items-center w-full px-4 py-3 text-white bg-purple-800 rounded-lg" 
            aria-current="page"
          >
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Dashboard
          </button>

          <button 
            className="flex items-center w-full px-4 py-3 mt-1 text-purple-200 hover:bg-purple-700 rounded-lg"
            onClick={() => handleSidebarNavigation('/my-exams')}
          >
            My Exams
          </button>
          <button 
            className="flex items-center w-full px-4 py-3 mt-1 text-purple-200 hover:bg-purple-700 rounded-lg"
            onClick={() => handleSidebarNavigation('/results')}
          >
            Results
          </button>
          <button 
            className="flex items-center w-full px-4 py-3 mt-1 text-purple-200 hover:bg-purple-700 rounded-lg"
            onClick={() => handleSidebarNavigation('/settings')}
          >
            Settings
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden" role="main">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700 mr-3" aria-label="Open sidebar">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center">
              <button className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none mr-4" aria-label="Notifications">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileMenuOpen(prev => !prev)}
                  className="flex items-center max-w-xs rounded-full focus:outline-none"
                  aria-label="User menu"
                  aria-haspopup="true"
                  aria-expanded={profileMenuOpen}
                >
                  <img className="h-8 w-8 rounded-full object-cover" src={user?.avatar} alt="User avatar" />
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">{user?.name}</span>
                  <svg className="ml-1 h-4 w-4 text-gray-500 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>

                {profileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5" role="menu" aria-label="Profile options">
                    <div className="py-1">
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                        role="menuitem"
                        onClick={() => handleProfileMenuItemClick('profile')}
                      >
                        Your Profile
                      </button>
                      <button 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" 
                        role="menuitem"
                        onClick={() => handleProfileMenuItemClick('settings')}
                      >
                        Settings
                      </button>
                      <button
                        onClick={() => handleProfileMenuItemClick('signout')}
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-purple-400 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-purple-100 truncate">Upcoming Exams</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-white">{counts.upcoming}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-400 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-blue-100 truncate">Completed</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-white">{counts.completed}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-400 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-yellow-100 truncate">In Progress</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-white">{counts.inProgress}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-400 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-indigo-100 truncate">Total Exams</dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-white">{counts.total}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exams list */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Exams</h2>
            <div className="flex mt-2 sm:mt-0 space-x-2">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Export</button>
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">New Exam</button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const formattedDateTime = formatDateTime(exam.startTime);
              const progress = calculateProgress(exam.status, exam.score);
              return (
                <article key={exam.id} className={`bg-white overflow-hidden shadow-lg rounded-xl transform transition-all duration-300 hover:shadow-xl ${getStatusColor(exam.status)}`}>
                  <div className="px-6 py-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{exam.title}</h3>
                        <p className="mt-1 text-sm text-indigo-600 font-medium">{exam.course}</p>
                      </div>
                      {getStatusBadge(exam.status)}
                    </div>

                    <p className="mt-3 text-sm text-gray-600 line-clamp-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{exam.description}</p>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span>{exam.instructor}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <div>
                          <span className="block">{formattedDateTime.date}</span>
                          <span className="block text-xs">{formattedDateTime.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <svg className="flex-shrink-0 mr-2 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{exam.duration} minutes</span>
                      </div>

                      {exam.status === 'completed' && exam.score && (
                        <div className="pt-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Score</span>
                            <span className="font-medium text-green-600">{exam.score}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${exam.score}%` }} />
                          </div>
                        </div>
                      )}

                      {exam.status === 'in-progress' && (
                        <div className="pt-2">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Progress</span>
                            <span className="font-medium text-yellow-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6">
                      {exam.status === 'upcoming' ? (
                        <button onClick={() => handleStartExam(exam.id)} aria-label={`Start exam ${exam.title}`} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">Start Exam</button>
                      ) : exam.status === 'completed' ? (
                        <button className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" aria-label={`View results for ${exam.title}`}>View Results</button>
                      ) : (
                        <button onClick={() => handleStartExam(exam.id)} aria-label={`Continue exam ${exam.title}`} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">Continue Exam</button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}
    </div>
  );
};

export default Dashboard;