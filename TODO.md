# Email System Implementation TODO

## Phase 1: Setup & Dependencies
- [x] 1. Install nodemailer package

## Phase 2: Database Model Updates
- [x] 2. Update User model - Add token fields (verificationToken, resetPasswordToken, resetPasswordExpires)

## Phase 3: Email Utility
- [x] 3. Create utils/email.js - Email sending utility with nodemailer

## Phase 4: Controller Updates
- [x] 4. Update controllers/users.js
  - [x] Modify signup to send verification email
  - [x] Add verifyEmail controller
  - [x] Add forgotPassword controller
  - [x] Add resetPassword controller
  - [x] Modify login to check isVerified

## Phase 5: Route Updates
- [x] 5. Update routes/user.js
  - [x] Add verification routes (GET/POST /verify-email)
  - [x] Add forgot password routes (GET/POST /forgot-password)
  - [x] Add reset password route (GET/POST /reset-password/:token)

## Phase 6: View Updates
- [x] 6. Update views/users/login.ejs - Add forgot password link
- [x] 7. Create views/users/forgot-password.ejs - Forgot password page
- [x] 8. Create views/users/reset-password.ejs - Reset password page
- [x] 9. Update views/users/signup.ejs - Show verification message

## Phase 7: Environment Configuration
- [x] 10. Add email configuration to .env.example
