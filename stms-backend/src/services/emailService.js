const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.sendOTP = async (email, otp) => {
    const mailOptions = {
        from: `"AcadTrack Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your AcadTrack Verification Code',
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #03453d;">AcadTrack Verification</h2>
                <p>Hello,</p>
                <p>Thank you for registering. Please use the following code to verify your account:</p>
                <div style="background: #f0fdf4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #022c26; border-radius: 8px;">
                    ${otp}
                </div>
                <p style="margin-top: 20px;">This code will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">&copy; 2026 AcadTrack Academic Management</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

exports.sendResetCode = async (email, code) => {
    const mailOptions = {
        from: `"AcadTrack Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request',
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #03453d;">AcadTrack Security</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Use the code below to proceed:</p>
                <div style="background: #fdf2f2; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #991b1b; border-radius: 8px;">
                    ${code}
                </div>
                <p style="margin-top: 20px;">If you did not request a password reset, please secure your account immediately.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">&copy; 2026 AcadTrack Academic Management</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};

exports.sendAssignmentNotification = async (emails, assignment) => {
    const mailOptions = {
        from: `"AcadTrack Notifications" <${process.env.EMAIL_USER}>`,
        to: emails.join(','),
        subject: `New Assignment: ${assignment.title}`,
        html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #03453d;">New Academic Broadcast</h2>
                <p>Hello,</p>
                <p>A new assignment has been broadcasted for your course <strong>${assignment.course_name} (${assignment.course_code})</strong>.</p>
                <div style="background: #f0fdf4; padding: 20px; border-radius: 12px; border-left: 4px solid #03453d; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #03453d;">${assignment.title}</h3>
                    <p style="white-space: pre-wrap;">${assignment.description || 'No description provided.'}</p>
                    <div style="margin-top: 15px; font-size: 14px; border-top: 1px solid #dcfce7; pt: 10px;">
                        <strong>Due Date:</strong> ${new Date(assignment.due_date).toLocaleString()}<br>
                        <strong>Marks:</strong> ${assignment.marks}
                    </div>
                </div>
                <p>Please log in to your AcadTrack portal to view full details and submit your work.</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #666;">This is an automated notification from AcadTrack Academic Management.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
};
