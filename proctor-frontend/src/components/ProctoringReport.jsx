import React, { useState, useEffect } from 'react';

const ProctoringReport = ({ sessionId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = 'http://localhost:8080';

  useEffect(() => {
    fetchReport();
  }, [sessionId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // First try to get existing report
      const response = await fetch(`${BACKEND_URL}/api/proctoring-reports/session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const reports = await response.json();
        if (reports.length > 0) {
          setReport(reports[0]);
        } else {
          // If no report exists, generate one
          await generateReport();
        }
      } else {
        // If fetching fails, try to generate a new report
        await generateReport();
      }
    } catch (err) {
      setError('Failed to fetch report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/api/proctoring-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sessionId })
      });
      
      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (err) {
      setError('Failed to generate report');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-500">Error: {error}</div>
        <button 
          onClick={fetchReport}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-gray-500">No report available</div>
      </div>
    );
  }

  // Parse summary JSON
  let summary = {};
  try {
    summary = JSON.parse(report.summaryJson);
  } catch (e) {
    console.error('Error parsing summary JSON', e);
  }

  // Parse events JSON
  let events = [];
  try {
    events = JSON.parse(report.suspicionEventsJson);
  } catch (e) {
    console.error('Error parsing events JSON', e);
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Proctoring Report</h3>
        <p className="mt-1 text-sm text-gray-500">Session #{report.sessionId}</p>
      </div>
      
      <div className="p-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="text-sm text-blue-700 font-medium">Total Events</div>
            <div className="text-2xl font-bold text-blue-900">{summary.totalEvents || 0}</div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
            <div className="text-sm text-yellow-700 font-medium">Total Score</div>
            <div className="text-2xl font-bold text-yellow-900">{Math.round(report.totalSuspicionScore || 0)}</div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="text-sm text-orange-700 font-medium">Critical/High</div>
            <div className="text-2xl font-bold text-orange-900">
              {(summary.criticalEvents || 0) + (summary.highEvents || 0)}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="text-sm text-green-700 font-medium">Generated</div>
            <div className="text-sm text-green-900">{formatDateTime(report.createdAt)}</div>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="mb-8">
          <h4 className="text-md font-medium text-gray-700 mb-4">Event Severity Distribution</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-red-700 font-medium">Critical ({summary.criticalEvents || 0})</span>
                <span className="text-gray-600">{summary.criticalEvents || 0} events</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${((summary.criticalEvents || 0) / (summary.totalEvents || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-orange-700 font-medium">High ({summary.highEvents || 0})</span>
                <span className="text-gray-600">{summary.highEvents || 0} events</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${((summary.highEvents || 0) / (summary.totalEvents || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-yellow-700 font-medium">Medium ({summary.mediumEvents || 0})</span>
                <span className="text-gray-600">{summary.mediumEvents || 0} events</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${((summary.mediumEvents || 0) / (summary.totalEvents || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-blue-700 font-medium">Low ({summary.lowEvents || 0})</span>
                <span className="text-gray-600">{summary.lowEvents || 0} events</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${((summary.lowEvents || 0) / (summary.totalEvents || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Types */}
        {summary.eventTypes && (
          <div className="mb-8">
            <h4 className="text-md font-medium text-gray-700 mb-4">Event Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(summary.eventTypes).map(([type, count]) => (
                <div key={type} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-sm font-medium text-gray-700">{type.replace(/_/g, ' ')}</div>
                  <div className="text-lg font-bold text-gray-900">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Events */}
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4">Recent Proctoring Events</h4>
          {events.length === 0 ? (
            <p className="text-sm text-gray-500">No events recorded</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {events.slice(0, 10).map((event, index) => (
                <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(event.severity)}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium">{event.eventType.replace(/_/g, ' ')}</h5>
                      <p className="text-sm mt-1">{event.detailJson}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                      {event.severity}
                    </span>
                  </div>
                  <div className="text-xs mt-2 text-gray-600">
                    {formatDateTime(event.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
          <button 
            onClick={generateReport}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Refresh Report
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
            Export PDF
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
            Share Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProctoringReport;