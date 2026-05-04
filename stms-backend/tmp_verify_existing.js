require('dotenv').config();
const pool = require('./src/config/db');

const run = async () => {
    try {
        const [r] = await pool.execute('UPDATE users SET is_verified = 1 WHERE is_verified = 0 OR is_verified IS NULL');
        console.log(`Migrated ${r.affectedRows} existing user(s) to verified.`);
    } finally {
        process.exit(0);
    }
};
run();
