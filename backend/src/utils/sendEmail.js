const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function sendWelcomeEmail(to, name, email, tempPassword, buildingName) {
  const mailOptions = {
    from: `"NestHub" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Welcome to ${buildingName} — Your NestHub Account`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0D4F4E;">Welcome to NestHub, ${name}!</h2>
        <p>An account has been created for you at <strong>${buildingName}</strong>. Here are your login credentials:</p>
        <div style="background: #F5F6F8; border-radius: 12px; padding: 16px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 4px 0;"><strong>Temporary Password:</strong> ${tempPassword}</p>
        </div>
        <p>Please log in to the NestHub app and change your password on first login.</p>
        <p style="color: #6B7280; font-size: 13px; margin-top: 24px;">If you did not expect this email, please contact your building manager.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendWelcomeEmail };