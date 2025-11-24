import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProctoringDashboard from './ProctoringDashboard';

const ExamScreen = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const websocketRef = useRef(null);
  const [exam, setExam] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5400); // 90 minutes in seconds
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [suspicionLevel, setSuspicionLevel] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [proctoringEvents, setProctoringEvents] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const BACKEND_URL = 'http://localhost:8080';
  const ML_SERVICE_URL = 'http://localhost:8000';
  const WEBSOCKET_URL = 'ws://localhost:8080/ws';

  // Sample questions for demonstration
  const questions = [
    {
      id: 1,
      text: "What is the derivative of x^2?",
      options: ["2x", "x^2", "2x^2", "x"],
      type: "MCQ"
    },
    {
      id: 2,
      text: "Solve for x: 2x + 5 = 15",
      options: ["x = 5", "x = 10", "x = 7.5", "x = 2.5"],
      type: "MCQ"
    },
    {
      id: 3,
      text: "Explain the Pythagorean theorem.",
      type: "SUBJECTIVE"
    }
  ];

  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id);
    }

    // Fetch exam details from backend
    fetchExamDetails();

    // Start exam session
    startExamSession();

    // Start timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Initialize webcam
    initializeWebcam();

    // Add event listeners for proctoring
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // Block copy/paste and keyboard shortcuts
    const handleCopyPaste = (e) => {
      e.preventDefault();
      addAlert('Copy/Paste is disabled during exam.');
      if (sessionId) {
        logEvent('COPY_PASTE_ATTEMPT', JSON.stringify({ action: e.type }), 'MEDIUM');
      }
      return false;
    };

    const handleKeyboardShortcuts = (e) => {
      // Block common shortcuts: Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, F5, Ctrl+R, Ctrl+P, PrintScreen
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'p', 'r'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        addAlert(`Keyboard shortcut ${e.key.toUpperCase()} is disabled during exam.`);
        if (sessionId) {
          logEvent('KEYBOARD_SHORTCUT_ATTEMPT', JSON.stringify({ key: e.key, ctrlKey: e.ctrlKey }), 'MEDIUM');
        }
        return false;
      }
      if (e.key === 'F5' || e.key === 'PrintScreen') {
        e.preventDefault();
        addAlert(`${e.key} is disabled during exam.`);
        if (sessionId) {
          logEvent('KEYBOARD_SHORTCUT_ATTEMPT', JSON.stringify({ key: e.key }), 'MEDIUM');
        }
        return false;
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      addAlert('Right-click is disabled during exam.');
      if (sessionId) {
        logEvent('RIGHT_CLICK_ATTEMPT', JSON.stringify({ action: 'contextmenu' }), 'LOW');
      }
      return false;
    };

    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('cut', handleCopyPaste);
    document.addEventListener('keydown', handleKeyboardShortcuts);
    document.addEventListener('contextmenu', handleContextMenu);

    // Start frame capture interval (every 5 seconds)
    const frameCaptureInterval = setInterval(() => {
      captureAndAnalyzeFrame();
    }, 5000);

    // Auto-save answers every 30 seconds
    const autoSaveInterval = setInterval(() => {
      autoSaveAnswers();
    }, 30000);

    // Clean up
    return () => {
      clearInterval(timer);
      clearInterval(frameCaptureInterval);
      clearInterval(autoSaveInterval);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('cut', handleCopyPaste);
      document.removeEventListener('keydown', handleKeyboardShortcuts);
      document.removeEventListener('contextmenu', handleContextMenu);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      // Close WebSocket connection
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [examId]);

  const fetchExamDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/exams/${examId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const examData = await response.json();
        setExam(examData);
        if (examData.durationMin) {
          setTimeLeft(examData.durationMin * 60);
        }
      } else {
        // Fallback to mock data if API fails
        setExam({
          id: examId,
          title: 'Mathematics Midterm',
          course: 'Math 101',
          duration: 90
        });
      }
    } catch (error) {
      console.error('Error fetching exam:', error);
      // Fallback to mock data
      setExam({
        id: examId,
        title: 'Mathematics Midterm',
        course: 'Math 101',
        duration: 90
      });
    }
  };

  const startExamSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        console.error('User not found in localStorage');
        return;
      }
      const user = JSON.parse(userStr);
      
      const response = await fetch(`${BACKEND_URL}/api/exam-sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          examId: parseInt(examId),
          userId: user.id
        })
      });

      if (response.ok) {
        const sessionData = await response.json();
        setSessionId(sessionData.id);
        if (sessionData.suspicionScore) {
          setSuspicionLevel(sessionData.suspicionScore);
        }
        addAlert('Exam session started. Proctoring is active.');
        
        // Initialize WebSocket connection
        initializeWebSocket(sessionData.id);
      } else {
        console.error('Failed to start exam session');
      }
    } catch (error) {
      console.error('Error starting exam session:', error);
    }
  };

  const initializeWebSocket = (sessionId) => {
    try {
      // Create WebSocket connection
      const ws = new WebSocket(`${WEBSOCKET_URL}/session/${sessionId}`);
      
      ws.onopen = () => {
        console.log('WebSocket connection established');
        setConnectionStatus('connected');
        addAlert('Real-time proctoring connection established.');
        websocketRef.current = ws;
        
        // Send initial connection message
        ws.send(JSON.stringify({
          type: 'CONNECT',
          sessionId: sessionId,
          userId: userId
        }));
      };
      
      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('WebSocket message received:', message);
          
          // Handle different message types
          switch (message.type) {
            case 'ALERT':
              addAlert(message.content);
              break;
            case 'SUSPICION_UPDATE':
              setSuspicionLevel(message.suspicionScore);
              break;
            case 'INSTRUCTOR_MESSAGE':
              addAlert(`Instructor: ${message.content}`);
              break;
            case 'PROCTORING_ALERT':
              // Add to proctoring events
              const newEvent = {
                id: Date.now(),
                type: message.alertType,
                details: message.details,
                timestamp: new Date().toISOString()
              };
              setProctoringEvents(prev => [newEvent, ...prev.slice(0, 9)]);
              break;
            default:
              console.log('Unknown message type:', message.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
        addAlert('Connection issue with real-time proctoring.');
      };
      
      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setConnectionStatus('disconnected');
      };
    } catch (error) {
      console.error('Error initializing WebSocket:', error);
      setConnectionStatus('disconnected');
      addAlert('Failed to establish real-time proctoring connection.');
    }
  };

  const initializeWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      addAlert('Unable to access webcam. Please ensure permissions are granted.');
      logEvent('WEBCAM_ERROR', 'Unable to access webcam', 'HIGH');
    }
  };

  const captureAndAnalyzeFrame = async () => {
    if (!videoRef.current || !sessionId) return;

    try {
      // Create canvas to capture frame
      const video = videoRef.current;
      if (!video.videoWidth || !video.videoHeight) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        // Send to ML service
        const formData = new FormData();
        formData.append('file', blob, 'frame.jpg');

        try {
          const mlResponse = await fetch(`${ML_SERVICE_URL}/analyze-frame`, {
            method: 'POST',
            body: formData
          });

          if (mlResponse.ok) {
            const mlResult = await mlResponse.json();
            
            // Log event to backend
            if (mlResult.multiple_faces_detected) {
              logEvent('MULTIPLE_FACES', JSON.stringify(mlResult), 'MEDIUM');
              addAlert(`Multiple faces detected (${mlResult.face_count})`);
              
              // Send alert via WebSocket if connected
              if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                websocketRef.current.send(JSON.stringify({
                  type: 'PROCTORING_ALERT',
                  alertType: 'MULTIPLE_FACES',
                  sessionId: sessionId,
                  details: mlResult
                }));
              }
            }
            
            if (mlResult.face_count === 0) {
              logEvent('NO_FACE', JSON.stringify(mlResult), 'HIGH');
              addAlert('No face detected in frame');
              
              // Send alert via WebSocket if connected
              if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                websocketRef.current.send(JSON.stringify({
                  type: 'PROCTORING_ALERT',
                  alertType: 'NO_FACE',
                  sessionId: sessionId,
                  details: mlResult
                }));
              }
            }

            // Update suspicion score
            if (mlResult.suspicion_score !== undefined) {
              updateSuspicionScore(mlResult.suspicion_score);
            }
          }
        } catch (error) {
          console.error('Error analyzing frame:', error);
        }
      }, 'image/jpeg', 0.8);
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  };

  const logEvent = async (eventType, detailJson, severity) => {
    if (!sessionId) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${BACKEND_URL}/api/event-logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: sessionId,
          eventType: eventType,
          detailJson: detailJson,
          severity: severity || 'INFO'
        })
      });
    } catch (error) {
      console.error('Error logging event:', error);
    }
  };

  const updateSuspicionScore = async (newScore) => {
    if (!sessionId) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/exam-sessions/${sessionId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          suspicionScore: newScore
        })
      });

      if (response.ok) {
        setSuspicionLevel(newScore);
        
        // Notify via WebSocket if connected
        if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
          websocketRef.current.send(JSON.stringify({
            type: 'SUSPICION_UPDATE',
            sessionId: sessionId,
            suspicionScore: newScore
          }));
        }
      }
    } catch (error) {
      console.error('Error updating suspicion score:', error);
    }
  };

  const handleWindowBlur = () => {
    const newScore = Math.min(suspicionLevel + 10, 100);
    setSuspicionLevel(newScore);
    addAlert('Window lost focus. This event has been recorded.');
    logEvent('TAB_SWITCH', JSON.stringify({ action: 'window_blur' }), 'MEDIUM');
    updateSuspicionScore(newScore);
    
    // Send alert via WebSocket if connected
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({
        type: 'PROCTORING_ALERT',
        alertType: 'TAB_SWITCH',
        sessionId: sessionId,
        details: { action: 'window_blur' }
      }));
    }
  };

  const handleWindowFocus = () => {
    // Window regained focus
    addAlert('Window regained focus.');
  };

  const handleFullscreenChange = () => {
    const fullscreenElement = document.fullscreenElement || 
                            document.webkitFullscreenElement || 
                            document.mozFullScreenElement || 
                            document.msFullscreenElement;
    
    setIsFullscreen(!!fullscreenElement);
    
    if (!fullscreenElement) {
      addAlert('Exited full screen mode. This event has been recorded.');
      logEvent('FULLSCREEN_EXIT', JSON.stringify({ action: 'fullscreen_exit' }), 'MEDIUM');
      
      // Increase suspicion score for exiting fullscreen
      const newScore = Math.min(suspicionLevel + 15, 100);
      updateSuspicionScore(newScore);
      
      // Send alert via WebSocket if connected
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'PROCTORING_ALERT',
          alertType: 'FULLSCREEN_EXIT',
          sessionId: sessionId,
          details: { action: 'fullscreen_exit' }
        }));
      }
    }
  };

  const addAlert = (message) => {
    const newAlert = {
      id: Date.now(),
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]); // Keep only last 5 alerts
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    // Save to localStorage for persistence
    localStorage.setItem(`exam_${examId}_answers`, JSON.stringify({
      ...answers,
      [questionId]: answer
    }));
    
    // Save to backend
    if (sessionId) {
      saveAnswerToBackend(questionId, answer);
    }
  };

  const saveAnswerToBackend = async (questionId, answer) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${BACKEND_URL}/api/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: sessionId,
          questionId: questionId,
          answerText: answer
        })
      });
    } catch (error) {
      console.error('Error saving answer to backend:', error);
    }
  };

  const autoSaveAnswers = async () => {
    if (!sessionId || Object.keys(answers).length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      // Send all answers to backend
      for (const [questionId, answer] of Object.entries(answers)) {
        await fetch(`${BACKEND_URL}/api/answers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            sessionId: sessionId,
            questionId: parseInt(questionId),
            answerText: answer
          })
        });
      }
      console.log('Auto-saved answers to backend');
    } catch (error) {
      console.error('Error auto-saving answers:', error);
    }
  };

  const submitExam = async () => {
    try {
      if (sessionId) {
        const token = localStorage.getItem('token');
        // End exam session
        await fetch(`${BACKEND_URL}/api/exam-sessions/${sessionId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            status: 'SUBMITTED',
            endTime: new Date().toISOString()
          })
        });
      }
      alert('Exam submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Exam submitted (with errors).');
      navigate('/dashboard');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full screen warning */}
      <div className={`fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center ${isFullscreen ? 'hidden' : 'block'}`}>
        <div className="bg-white rounded-lg p-8 max-w-md w-full">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Full Screen Required</h3>
          <p className="text-gray-500 mb-6">
            Please press F11 or click the button below to enter full screen mode to continue the exam.
          </p>
          <button
            onClick={toggleFullscreen}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Enter Full Screen
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{exam?.title}</h1>
            <p className="text-sm text-gray-500">{exam?.course}</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Time Remaining</p>
              <p className="text-2xl font-bold text-indigo-600">{formatTime(timeLeft)}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Suspicion Level</p>
              <div className="w-32 h-4 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    suspicionLevel < 30 ? 'bg-green-500' : 
                    suspicionLevel < 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${suspicionLevel}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{suspicionLevel}%</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main exam area */}
          <div className="lg:w-3/4">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <div className="mb-6">
                  <p className="text-gray-700">{questions[currentQuestion]?.text}</p>
                </div>

                {questions[currentQuestion]?.type === 'MCQ' ? (
                  <div className="space-y-4">
                    {questions[currentQuestion]?.options.map((option, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          id={`option-${index}`}
                          name={`question-${questions[currentQuestion].id}`}
                          type="radio"
                          className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                          checked={answers[questions[currentQuestion].id] === option}
                          onChange={() => handleAnswerChange(questions[currentQuestion].id, option)}
                        />
                        <label htmlFor={`option-${index}`} className="ml-3 block text-gray-700">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <textarea
                      rows={6}
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-3"
                      placeholder="Type your answer here..."
                      value={answers[questions[currentQuestion].id] || ''}
                      onChange={(e) => handleAnswerChange(questions[currentQuestion].id, e.target.value)}
                    />
                  </div>
                )}

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestion === 0}
                    className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm ${
                      currentQuestion === 0 
                        ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                        : 'text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                    }`}
                  >
                    Previous
                  </button>
                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={submitExam}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Submit Exam
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4 space-y-6">
            {/* Enhanced Proctoring Dashboard */}
            {sessionId && <ProctoringDashboard sessionId={sessionId} />}
            
            {/* Webcam feed */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Webcam Feed</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  className="w-full h-auto border border-gray-300 rounded-md"
                />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <p className="mt-2 text-sm text-gray-500">
                  Your webcam feed is being monitored for proctoring purposes.
                </p>
                {sessionId && (
                  <p className="mt-1 text-xs text-green-600">
                    ✓ Proctoring active (Session: {sessionId})
                  </p>
                )}
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Proctoring Alerts</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                {alerts.length === 0 ? (
                  <p className="text-sm text-gray-500">No alerts at this time.</p>
                ) : (
                  <ul className="space-y-2">
                    {alerts.map(alert => (
                      <li key={alert.id} className="text-sm p-2 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex justify-between">
                          <span>{alert.message}</span>
                          <span className="text-gray-500">{alert.timestamp}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Question navigator */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Questions</h3>
              </div>
              <div className="px-4 py-5 sm:px-6">
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-medium ${
                        currentQuestion === index
                          ? 'bg-indigo-600 text-white'
                          : answers[questions[index].id]
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamScreen;