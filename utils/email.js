const nodemailer = require("nodemailer");
const crypto = require("crypto");

// Create transporter based on environment
const createTransporter = () => {
    // For development, use a test service or console logging
    // In production, configure with real SMTP settings
    
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        // Production SMTP configuration
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT || 587,
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    } else {
        // Development: Use ethereal for testing or console log
        // For now, return a mock transporter that logs emails
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: "test@ethereal.email",
                pass: "testpass"
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }
};

// Generate a random verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// Generate a random reset password token
const generateResetPasswordToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

// Send verification email
const sendVerificationEmail = async (user, verificationToken) => {
    const transporter = createTransporter();
    
    const verifyUrl = `${process.env.BASE_URL || 'http://localhost:8080'}/verify-email/${verificationToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"HostHaven" <noreply@hosthaven.com>',
        to: user.email,
        subject: "Verify your HostHaven account",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #003049, #1a5276); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; background: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 30px; background: #D62828; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Welcome to HostHaven!</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${user.username},</p>
                        <p>Thank you for signing up for HostHaven! To get started, please verify your email address by clicking the button below:</p>
                        <div style="text-align: center;">
                            <a href="${verifyUrl}" class="button">Verify Email</a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
                        <p>This link will expire in 24 hours.</p>
                        <p>If you didn't create an account with HostHaven, please ignore this email.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} HostHaven. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        // In development, just log the email
        if (!process.env.EMAIL_HOST) {
            console.log("=== EMAIL (Development Mode) ===");
            console.log("To:", user.email);
            console.log("Subject:", mailOptions.subject);
            console.log("Verification URL:", verifyUrl);
            console.log("================================");
            return { success: true, messageId: "dev-mode" };
        }
        
        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending verification email:", error);
        return { success: false, error: error.message };
    }
};

// Send password reset email
const sendPasswordResetEmail = async (user, resetToken) => {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:8080'}/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"HostHaven" <noreply@hosthaven.com>',
        to: user.email,
        subject: "Reset your HostHaven password",
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #003049, #1a5276); color: white; padding: 30px; text-align: center; }
                    .content { padding: 30px; background: #f9f9f9; }
                    .button { display: inline-block; padding: 12px 30px; background: #D62828; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Password Reset Request</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${user.username},</p>
                        <p>We received a request to reset your password. Click the button below to create a new password:</p>
                        <div style="text-align: center;">
                            <a href="${resetUrl}" class="button">Reset Password</a>
                        </div>
                        <p>Or copy and paste this link into your browser:</p>
                        <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                        <p><strong>This link will expire in 1 hour.</strong></p>
                        <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} HostHaven. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
    
    try {
        // In development, just log the email
        if (!process.env.EMAIL_HOST) {
            console.log("=== EMAIL (Development Mode) ===");
            console.log("To:", user.email);
            console.log("Subject:", mailOptions.subject);
            console.log("Reset URL:", resetUrl);
            console.log("================================");
            return { success: true, messageId: "dev-mode" };
        }
        
        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Error sending password reset email:", error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    generateVerificationToken,
    generateResetPasswordToken,
    sendVerificationEmail,
    sendPasswordResetEmail
};
