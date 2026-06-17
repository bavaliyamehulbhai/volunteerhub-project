const applicationApproved = (name, eventTitle) => `
<div style="font-family: Arial; padding:20px;">
  <h2>VolunteerHub</h2>
  <p>Hello ${name},</p>
  <h2>Congratulations!</h2>
  <p>Your application for <b>${eventTitle}</b> has been approved.</p>
  <br/>
  <a href="https://volunteerhub.com" style="background:#2563eb; color:white; padding:12px; text-decoration:none;">
    View Dashboard
  </a>
</div>
`;

module.exports = applicationApproved;
