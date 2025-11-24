-- Sample data for Online Exam Proctoring Portal

-- Insert sample users
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@example.com', '$2a$10$abcdefghijklmnopqrstuvwxynoKzaxhzihqu1D5X', 'ADMIN'),
('John Instructor', 'instructor@example.com', '$2a$10$abcdefghijklmnopqrstuvwxynoKzaxhzihqu1D5X', 'INSTRUCTOR'),
('Jane Student', 'student@example.com', '$2a$10$abcdefghijklmnopqrstuvwxynoKzaxhzihqu1D5X', 'STUDENT');

-- Insert sample courses
INSERT INTO courses (title, instructor_id) VALUES
('Mathematics 101', 2),
('Physics 201', 2);

-- Insert sample exams
INSERT INTO exams (course_id, title, start_time, duration_min, max_marks) VALUES
(1, 'Midterm Exam', '2023-06-15 10:00:00', 90, 100),
(2, 'Final Exam', '2023-06-20 14:00:00', 120, 150);

-- Insert sample questions
INSERT INTO questions (exam_id, type, question_text, options_json, answer_key) VALUES
(1, 'MCQ', 'What is the derivative of x^2?', '["2x", "x^2", "2x^2", "x"]', '2x'),
(1, 'MCQ', 'Solve for x: 2x + 5 = 15', '["x = 5", "x = 10", "x = 7.5", "x = 2.5"]', 'x = 5'),
(1, 'SUBJECTIVE', 'Explain the Pythagorean theorem.', NULL, 'In a right-angled triangle, the square of the hypotenuse is equal to the sum of squares of the other two sides.');

-- Insert sample exam session
INSERT INTO exam_sessions (exam_id, user_id, start_time, status) VALUES
(1, 3, '2023-06-15 10:00:00', 'IN_PROGRESS');

-- Insert sample answers
INSERT INTO answers (session_id, question_id, answer_text) VALUES
(1, 1, '2x'),
(1, 2, 'x = 5'),
(1, 3, 'The Pythagorean theorem states that in a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.');