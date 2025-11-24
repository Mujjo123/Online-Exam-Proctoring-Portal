-- Database schema for Online Exam Proctoring Portal

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL,
  reg_photo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE IF NOT EXISTS courses (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  instructor_id BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id)
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  course_id BIGINT NOT NULL,
  title VARCHAR(200) NOT NULL,
  start_time DATETIME,
  duration_min INT,
  max_marks INT,
  proctoring_settings_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Questions table
CREATE TABLE IF NOT EXISTS questions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  exam_id BIGINT NOT NULL,
  type VARCHAR(20) NOT NULL,
  question_text TEXT NOT NULL,
  options_json TEXT,
  answer_key TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);

-- Exam sessions table
CREATE TABLE IF NOT EXISTS exam_sessions (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  exam_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  start_time DATETIME,
  end_time DATETIME,
  status VARCHAR(20) NOT NULL,
  final_score DOUBLE,
  suspicion_score DOUBLE DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (exam_id) REFERENCES exams(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Answers table
CREATE TABLE IF NOT EXISTS answers (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  question_id BIGINT NOT NULL,
  answer_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);

-- Event logs table
CREATE TABLE IF NOT EXISTS event_logs (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  timestamp DATETIME NOT NULL,
  event_type VARCHAR(50) NOT NULL,
  detail_json TEXT,
  severity VARCHAR(20) NOT NULL,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id)
);

-- Recordings table
CREATE TABLE IF NOT EXISTS recordings (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  type VARCHAR(10) NOT NULL, -- 'video' or 'audio'
  s3_url VARCHAR(500),
  start_ts DATETIME,
  end_ts DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  reviewer_id BIGINT NOT NULL,
  verdict VARCHAR(20),
  comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

-- Plagiarism reports table
CREATE TABLE IF NOT EXISTS plagiarism_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  similarity_score DOUBLE,
  matched_sources_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id)
);

-- Proctoring reports table
CREATE TABLE IF NOT EXISTS proctoring_reports (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  session_id BIGINT NOT NULL,
  student_id BIGINT NOT NULL,
  exam_id BIGINT NOT NULL,
  total_suspicion_score DOUBLE,
  max_suspicion_score DOUBLE,
  suspicion_events_json TEXT,
  summary_json TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES exam_sessions(id),
  FOREIGN KEY (student_id) REFERENCES users(id),
  FOREIGN KEY (exam_id) REFERENCES exams(id)
);