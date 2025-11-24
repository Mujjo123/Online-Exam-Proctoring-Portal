import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ExamLobby = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [microphoneAccess, setMicrophoneAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching exam details
    setExam({
      id: examId,
      title: 'Mathematics Midterm',
      course: 'Math 101',
      duration: 90,
      startTime: '2023-06-15T10:00:00Z',
      proctoringSettings: {
        webcamRequired: true,
        microphoneRequired: true,
        screenSharingDetection: true,
        tabSwitchDetection: true
      }
    });

    // Check camera and microphone access
    checkMediaAccess();

    setLoading(false);
  }, [examId]);

  const checkMediaAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setCameraAccess(true);
      setMicrophoneAccess(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Media access error:', err);
      setCameraAccess(false);
      setMicrophoneAccess(false);
    }
  };

  const startExam = () => {
    navigate(`/exam/${examId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">ProctorPortal</h1>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-2xl font-bold text-gray-900">{exam?.title}</h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">{exam?.course}</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{exam?.duration} minutes</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Start Time</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {exam?.startTime && new Date(exam.startTime).toLocaleString()}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Proctoring Requirements</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            Webcam Access
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {cameraAccess ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Granted
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Denied
                            </span>
                          )}
                        </div>
                      </li>
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            Microphone Access
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          {microphoneAccess ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Granted
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Denied
                            </span>
                          )}
                        </div>
                      </li>
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            Tab Switch Detection
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Enabled
                          </span>
                        </div>
                      </li>
                      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            Screen Sharing Detection
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Enabled
                          </span>
                        </div>
                      </li>
                    </ul>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Instructions</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Ensure you are in a quiet environment</li>
                      <li>Position your camera at eye level</li>
                      <li>Do not leave the exam window during the test</li>
                      <li>Any suspicious activity will be flagged</li>
                      <li>You have one attempt only</li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={startExam}
              disabled={!cameraAccess || !microphoneAccess}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                cameraAccess && microphoneAccess
                  ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamLobby;