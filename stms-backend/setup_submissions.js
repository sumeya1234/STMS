const pool = require('./src/config/db');

async function setup() {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS submissions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                assignment_id INT NOT NULL,
                student_id INT NOT NULL,
                file_path VARCHAR(255),
                submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status ENUM('Submitted', 'Graded') DEFAULT 'Submitted',
                grade INT,
                feedback TEXT,
                FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
                FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('Submissions table created successfully');
        process.exit(0);
    } catch (e) {
        console.error('Error creating submissions table:', e);
        process.exit(1);
    }
}

setup();
