-- Academic Task Distribution & Management System - Database Schema

-- 1. USERS TABLE (Shared by Teachers and Students)
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Teacher', 'Student') NOT NULL,
    department VARCHAR(150) NOT NULL,
    study_year INT NULL, -- NULL for Teachers, 1-4 for Students
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. ASSIGNMENTS TABLE (Broadcasted by Teachers)
CREATE TABLE IF NOT EXISTS assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    teacher_id INT NOT NULL,
    target_department VARCHAR(150) NOT NULL,
    target_year INT NOT NULL,
    course_name VARCHAR(150) NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    marks DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    file_path VARCHAR(255) NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. STUDENT TASKS TABLE (The Unified ToDo List)
CREATE TABLE IF NOT EXISTS student_tasks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    assignment_id INT NULL, -- NULL indicates a student's personal DIY task
    title VARCHAR(200) NOT NULL,
    description TEXT,
    course_info VARCHAR(150) NULL, -- Free text, allows student to link to arbitrary info
    due_date DATETIME NOT NULL,
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
    is_personal BOOLEAN NOT NULL DEFAULT 0, -- 1=personal, 0=teacher generated
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE SET NULL
);

-- INDEXES for O(log n) optimization
CREATE INDEX idx_user_role_dept_year ON users(role, department, study_year);
CREATE INDEX idx_assignment_target ON assignments(target_department, target_year);
CREATE INDEX idx_student_task_owner ON student_tasks(student_id);
