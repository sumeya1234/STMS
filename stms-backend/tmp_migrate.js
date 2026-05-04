const mysql = require('mysql2/promise');
require('dotenv').config();

const migrate = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD || process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    console.log('Migrating database...');
    try {
        await connection.execute(`
            ALTER TABLE users 
            ADD COLUMN is_verified TINYINT DEFAULT 0, 
            ADD COLUMN otp_code VARCHAR(10) NULL, 
            ADD COLUMN otp_expires_at DATETIME NULL
        `);
        console.log('Migration successful: Added verification columns.');
    } catch (e) {
        if (e.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Columns already exist, skipping.');
        } else {
            console.error('Migration failed:', e);
        }
    } finally {
        await connection.end();
    }
};

migrate();
