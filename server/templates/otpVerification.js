const otpVerification = (name, otp) => `
<div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
  <div style="text-align: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 20px;">
    <h2 style="color: #4f46e5; margin: 0;">VolunteerHub Security</h2>
  </div>
  <div style="padding: 20px 0;">
    <p>Hello ${name},</p>
    <p>A sign-in request was made for your account. Please use the following One-Time Password (OTP) to complete your login:</p>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: center; margin: 24px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e1b4b;">${otp}</span>
    </div>
    <p style="font-size: 13px; color: #64748b;">This OTP code is valid for <b>5 minutes</b>. If you did not request this login, please change your password immediately and contact administration.</p>
  </div>
  <div style="border-top: 1px solid #f1f5f9; padding-top: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
    <p>This is an automated security notification from VolunteerHub.</p>
  </div>
</div>
`;

module.exports = otpVerification;
