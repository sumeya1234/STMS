const mysql = require('mysql2/promise');
require('dotenv').config();

async function verify() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'stms'
    });

    try {
        const [result] = await pool.query(
            "UPDATE users SET email_verified = 1 WHERE email = 'tester_123@university.edu'"
        );
        console.log('User verified:', result.affectedRows);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verify();
