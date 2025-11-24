import React, { useState, useEffect } from 'react';

const ProctoringDashboard = ({ sessionId }) => {
  const [suspicionScore, setSuspicionScore] = useState(0);
  const [events, setEvents] = useState([]);
  const [webcamStatus, setWebcamStatus] = useState('active');
  const [audioStatus, setAudioStatus] = useState('active');
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [suspicionHistory, setSuspicionHistory] = useState([]);
  const BACKEND_URL = 'http://localhost:8080';

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real implementation, this would fetch from the backend
      // For now, we'll simulate updates
      const newScore = Math.min(100, Math.max(0, suspicionScore + (Math.random() * 10 - 5)));
      setSuspicionScore(newScore);
      
      // Update suspicion history
      setSuspicionHistory(prev => {
        const newHistory = [...prev, { time: Date.now(), score: newScore }];
        // Keep only last 20 data points
        return newHistory.slice(-20);
      });
      
      // Add random events
      if (Math.random() > 0.7) {
        const eventTypes = [
          'TAB_SWITCH', 'MULTIPLE_FACES', 'NO_FACE', 'AUDIO_ANOMALY', 
          'SCREEN_SHARE', 'PHONE_DETECTION', 'GAZE_DEVIATION', 'FORBIDDEN_KEYPRESS'
        ];
        const severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
        
        const newEvent = {
          id: Date.now(),
          eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          timestamp: new Date().toISOString(),
          severity: severities[Math.floor(Math.random() * severities.length)],
          detail: 'Automated detection event'
        };
        
        setEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep last 10 events
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [suspicionScore]);

  const getSuspicionColor = (score) => {
    if (score < 30) return 'bg-green-500';
    if (score < 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-200 text-red-900 border-red-300';
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'bg-green-500';
      case 'disconnected': return 'bg-red-500';
      case 'connecting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Real-time Proctoring Dashboard</h3>
        <p className="mt-1 text-sm text-gray-500">Session #{sessionId}</p>
      </div>
      
      <div className="p-6">
        {/* Status Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(webcamStatus)}`}></div>
              <span className="text-sm font-medium text-gray-700">Webcam</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 capitalize">{webcamStatus}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(audioStatus)}`}></div>
              <span className="text-sm font-medium text-gray-700">Audio</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 capitalize">{audioStatus}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${getConnectionStatusColor(connectionStatus)}`}></div>
              <span className="text-sm font-medium text-gray-700">Connection</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 capitalize">{connectionStatus}</p>
          </div>
        </div>

        {/* Suspicion Score */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-md font-medium text-gray-700">Suspicion Score</h4>
            <span className="text-sm font-bold text-gray-900">{Math.round(suspicionScore)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${getSuspicionColor(suspicionScore)} transition-all duration-500`}
              style={{ width: `${suspicionScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">0</span>
            <span className="text-sm text-gray-500">100</span>
          </div>
        </div>

        {/* Suspicion History Chart */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-700 mb-3">Suspicion Trend</h4>
          <div className="h-32 bg-gray-50 rounded-lg p-4 border border-gray-200">
            {suspicionHistory.length > 1 ? (
              <div className="h-full flex items-end space-x-1">
                {suspicionHistory.map((point, index) => (
                  <div 
                    key={index}
                    className="flex-1 bg-blue-500 rounded-t"
                    style={{ 
                      height: `${Math.max(5, point.score)}%`,
                      minHeight: '2px'
                    }}
                  ></div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                Collecting data...
              </div>
            )}
          </div>
        </div>

        {/* Recent Events */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-md font-medium text-gray-700">Recent Events</h4>
            <span className="text-xs text-gray-500">{events.length} events</span>
          </div>
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No events detected yet</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {events.map(event => (
                <div key={event.id} className={`border rounded p-3 ${getSeverityColor(event.severity)}`}>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{event.eventType.replace('_', ' ')}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {event.severity}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {formatTime(event.timestamp)}
                  </p>
                  {event.detail && (
                    <p className="text-xs text-gray-700 mt-1">{event.detail}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-2">
          <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
            Refresh Feed
          </button>
          <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors">
            Report Issue
          </button>
          <button className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors">
            Emergency Stop
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProctoringDashboard;