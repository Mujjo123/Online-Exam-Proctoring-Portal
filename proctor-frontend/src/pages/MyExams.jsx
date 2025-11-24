import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MyExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching exams data
    setTimeout(() => {
      setExams([
        { id: 1, title: 'Mathematics Midterm', course: 'Math 101', date: '2023-06-15', status: 'upcoming', score: null },
        { id: 2, title: 'Physics Final', course: 'Physics 201', date: '2023-06-20', status: 'upcoming', score: null },
        { id: 3, title: 'Chemistry Quiz', course: 'Chemistry 101', date: '2023-06-10', status: 'completed', score: 85 },
        { id: 4, title: 'Biology Exam', course: 'Biology 101', date: '2023-06-18', status: 'in-progress', score: null }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">My Exams</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Exam List</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Details of all your exams.</p>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  {exams.map((exam) => (
                    <li key={exam.id}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-indigo-600 truncate">
                            {exam.title}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                              {exam.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <div className="mr-6 flex items-center text-sm text-gray-500">
                              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                              </svg>
                              {exam.course}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {exam.date}
                          </div>
                        </div>
                        {exam.score && (
                          <div className="mt-2">
                            <div className="flex justify-between text-sm text-gray-600">
                              <span>Score</span>
                              <span className="font-medium text-green-600">{exam.score}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                              <div className="bg-green-600 h-2 rounded-full" style={{ width: `${exam.score}%` }}></div>
                            </div>
                          </div>
                        )}
                        <div className="mt-4">
                          {exam.status === 'upcoming' ? (
                            <button
                              onClick={() => navigate(`/exam/${exam.id}/lobby`)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              Start Exam
                            </button>
                          ) : exam.status === 'completed' ? (
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              View Results
                            </button>
                          ) : (
                            <button
                              onClick={() => navigate(`/exam/${exam.id}/lobby`)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                              Continue Exam
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyExams;