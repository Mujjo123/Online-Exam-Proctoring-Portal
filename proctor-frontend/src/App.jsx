import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import MyExams from './pages/MyExams';
import Results from './pages/Results';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import InstructorDashboard from './pages/InstructorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ExamLobby from './components/ExamLobby'; // Add this import
import ExamScreen from './components/ExamScreen';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-exams" element={<MyExams />} />
          <Route path="/results" element={<Results />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/instructor-dashboard" element={<InstructorDashboard />} />
          <Route path="/exam/:examId/lobby" element={<ExamLobby />} />
          <Route path="/exam/:examId" element={<ExamScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;