const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const v = require('../services/inputValidator');
const emailService = require('../services/emailService');

// Helper to generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
    try {
        const { full_name, email, password, role, department, study_year } = req.body;

        if (!v.isNonEmpty(full_name)) return res.status(400).json({ message: 'Full name is required.' });
        if (!v.isValidEmail(email)) return res.status(400).json({ message: 'Valid email required.' });
        if (!v.isValidPassword(password)) return res.status(400).json({ message: 'Password too weak.' });
        if (!v.isValidRole(role)) return res.status(400).json({ message: 'Invalid role.' });
        if (!v.isNonEmpty(department)) return res.status(400).json({ message: 'Department required.' });

        const [existing] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'Email already registered.' });

        const otp = generateOTP();
        const otp_expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        const password_hash = await bcrypt.hash(password, 10);
        const yearInt = role === 'Student' ? parseInt(study_year) : null;

        const [result] = await pool.execute(
            'INSERT INTO users (full_name, email, password_hash, role, department, study_year, is_verified, otp_code, otp_expires_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)',
            [full_name.trim(), email.toLowerCase().trim(), password_hash, role, department.toLowerCase().trim(), yearInt, otp, otp_expiry]
        );

        await emailService.sendOTP(email, otp);

        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: email.toLowerCase()
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ? AND otp_code = ? AND otp_expires_at > NOW()', [email, otp]);

        if (users.length === 0) return res.status(400).json({ message: 'Invalid or expired OTP.' });

        await pool.execute('UPDATE users SET is_verified = 1, otp_code = NULL, otp_expires_at = NULL WHERE id = ?', [users[0].id]);

        const user = users[0];
        const token = jwt.sign(
            { id: user.id, role: user.role, department: user.department, study_year: user.study_year },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.json({
            message: 'Email verified successfully!',
            token,
            user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, department: user.department, study_year: user.study_year }
        });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed' });
    }
};

exports.resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();
        const otp_expiry = new Date(Date.now() + 10 * 60 * 1000);

        const [r] = await pool.execute('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ? AND is_verified = 0', [otp, otp_expiry, email]);
        if (r.affectedRows === 0) return res.status(400).json({ message: 'User not found or already verified.' });

        await emailService.sendOTP(email, otp);
        res.json({ message: 'New OTP sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to resend OTP' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required.' });
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);

        if (users.length === 0) return res.status(401).json({ message: 'Account not found.' });

        const user = users[0];

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ message: 'Invalid password.' });

        const token = jwt.sign(
            { id: user.id, role: user.role, department: user.department, study_year: user.study_year },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.json({
            token,
            user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role, department: user.department, study_year: user.study_year }
        });

    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { full_name, email, department, study_year } = req.body;
        const userId = req.user.id;
        const role = req.user.role;

        await pool.execute(
            'UPDATE users SET full_name = ?, email = ?, department = ?, study_year = ? WHERE id = ?',
            [full_name.trim(), email.toLowerCase().trim(), department.toLowerCase().trim(), role === 'Student' ? parseInt(study_year) : null, userId]
        );

        const token = jwt.sign(
            { id: userId, role, department: department.trim(), study_year: role === 'Student' ? parseInt(study_year) : null },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
        );

        res.json({
            message: 'Profile updated',
            token,
            user: { id: userId, full_name: full_name.trim(), email: email.toLowerCase().trim(), role, department: department.toLowerCase().trim(), study_year }
        });
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { old_password, new_password } = req.body;
        const [users] = await pool.execute('SELECT password_hash FROM users WHERE id = ?', [req.user.id]);

        const match = await bcrypt.compare(old_password, users[0].password_hash);
        if (!match) return res.status(400).json({ message: 'Old password incorrect.' });

        const hash = await bcrypt.hash(new_password, 10);
        await pool.execute('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);

        res.json({ message: 'Password updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Password update failed' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();
        const otp_expiry = new Date(Date.now() + 15 * 60 * 1000);

        const [r] = await pool.execute('UPDATE users SET otp_code = ?, otp_expires_at = ? WHERE email = ?', [otp, otp_expiry, email]);
        if (r.affectedRows === 0) return res.status(404).json({ message: 'Email not found.' });

        await emailService.sendResetCode(email, otp);
        res.json({ message: 'Reset code sent to your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Request failed' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, otp, new_password } = req.body;
        const [users] = await pool.execute('SELECT id FROM users WHERE email = ? AND otp_code = ? AND otp_expires_at > NOW()', [email, otp]);

        if (users.length === 0) return res.status(400).json({ message: 'Invalid or expired code.' });

        const hash = await bcrypt.hash(new_password, 10);
        await pool.execute('UPDATE users SET password_hash = ?, otp_code = NULL, otp_expires_at = NULL WHERE id = ?', [hash, users[0].id]);

        res.json({ message: 'Password reset successful. Please login.' });
    } catch (error) {
        res.status(500).json({ message: 'Reset failed' });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [req.user.id]);
        res.json({ message: 'Account deleted forever.' });
    } catch (error) {
        res.status(500).json({ message: 'Deletion failed' });
    }
};