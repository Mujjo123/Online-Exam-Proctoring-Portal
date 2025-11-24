import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProctoringReport from '../components/ProctoringReport';

const Results = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchExamSessions();
  }, []);

  const fetchExamSessions = async () => {
    try {
      // Mock data for demonstration
      const mockSessions = [
        {
          id: 1,
          examId: 1,
          examTitle: 'Mathematics Midterm',
          course: 'Calculus II',
          startTime: '2023-06-15T10:00:00Z',
          endTime: '2023-06-15T11:30:00Z',
          status: 'completed',
          finalScore: 85,
          suspicionScore: 25,
          proctoringReportId: 1
        },
        {
          id: 2,
          examId: 2,
          examTitle: 'Physics Final',
          course: 'Quantum Mechanics',
          startTime: '2023-06-10T14:00:00Z',
          endTime: '2023-06-10T16:00:00Z',
          status: 'completed',
          finalScore: 92,
          suspicionScore: 15,
          proctoringReportId: 2
        },
        {
          id: 3,
          examId: 3,
          examTitle: 'Chemistry Quiz',
          course: 'Organic Chemistry',
          startTime: '2023-06-12T09:00:00Z',
          endTime: '2023-06-12T09:45:00Z',
          status: 'completed',
          finalScore: 78,
          suspicionScore: 45,
          proctoringReportId: 3
        }
      ];
      
      setSessions(mockSessions);
      if (mockSessions.length > 0) {
        setSelectedExam(mockSessions[0]);
      }
    } catch (error) {
      console.error('Error fetching exam sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSuspicionLevel = (score) => {
    if (score < 30) return { level: 'Low', color: 'text-green-600' };
    if (score < 70) return { level: 'Medium', color: 'text-yellow-600' };
    return { level: 'High', color: 'text-red-600' };
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Exam Results</h1>
          <p className="mt-1 text-sm text-gray-500">View your exam results and proctoring insights</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Exam List */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Your Exams</h2>
                </div>
                <ul className="divide-y divide-gray-200">
                  {sessions.map((session) => {
                    const formattedStart = formatDateTime(session.startTime);
                    const suspicion = getSuspicionLevel(session.suspicionScore);
                    return (
                      <li 
                        key={session.id} 
                        className={`cursor-pointer hover:bg-gray-50 ${selectedExam?.id === session.id ? 'bg-blue-50' : ''}`}
                        onClick={() => setSelectedExam(session)}
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-medium text-indigo-600 truncate">
                              {session.examTitle}
                            </div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                              {session.status}
                            </span>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
              <div className="mr-4 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {formattedStart.date}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {formattedStart.time}
              </div>
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
              <span className={`font-medium ${suspicion.color}`}>
                {suspicion.level} Risk
              </span>
            </div>
                          </div>
                          <div className="mt-2 flex justify-between items-center">
                            <div className="text-lg font-bold text-gray-900">
                              {session.finalScore}%
                            </div>
                            <div className="text-sm text-gray-500">
                              Session #{session.id}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            {/* Exam Details and Proctoring Report */}
            <div className="lg:col-span-2">
              {selectedExam ? (
                <div className="space-y-6">
                  {/* Exam Summary */}
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">{selectedExam.examTitle}</h2>
                      <p className="mt-1 text-sm text-gray-500">{selectedExam.course}</p>
                    </div>
                    <div className="px-4 py-5 sm:px-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
                          <div className="text-sm text-blue-700 font-medium">Final Score</div>
                          <div className="text-3xl font-bold text-blue-900 mt-1">{selectedExam.finalScore}%</div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
                          <div className="text-sm text-green-700 font-medium">Duration</div>
                          <div className="text-3xl font-bold text-green-900 mt-1">90 min</div>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
                          <div className="text-sm text-purple-700 font-medium">Proctoring Risk</div>
                          <div className={`text-3xl font-bold mt-1 ${getSuspicionLevel(selectedExam.suspicionScore).color}`}>
                            {getSuspicionLevel(selectedExam.suspicionScore).level}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Exam Details</h3>
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Session ID</dt>
                            <dd className="mt-1 text-sm text-gray-900">#{selectedExam.id}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Status</dt>
                            <dd className="mt-1 text-sm text-gray-900">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedExam.status)}`}>
                                {selectedExam.status}
                              </span>
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDateTime(selectedExam.startTime).date} at {formatDateTime(selectedExam.startTime).time}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">End Time</dt>
                            <dd className="mt-1 text-sm text-gray-900">{formatDateTime(selectedExam.endTime).date} at {formatDateTime(selectedExam.endTime).time}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>

                  {/* Proctoring Report */}
                  <ProctoringReport sessionId={selectedExam.id} />
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No exam selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Select an exam from the list to view results and proctoring insights.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;