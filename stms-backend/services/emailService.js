const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (options) => {
    try {
        const mailOptions = {
            from: `ScholarFlow <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

const sendVerificationEmail = async (email, token) => {
    const url = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const html = `
        <h2>Welcome to ScholarFlow!</h2>
        <p>Please finish your registration by clicking the link below:</p>
        <a href="${url}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
    `;
    return sendEmail({ email, subject: 'ScholarFlow - Verify Your Email', html });
};

const sendPasswordResetEmail = async (email, token) => {
    const url = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const html = `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <a href="${url}">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email. The link expires in 1 hour.</p>
    `;
    return sendEmail({ email, subject: 'ScholarFlow - Password Reset', html });
};

module.exports = {
    sendEmail,
    sendVerificationEmail,
    sendPasswordResetEmail
};
