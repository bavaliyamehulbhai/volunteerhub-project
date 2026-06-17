const applicationSubmitted = (name, eventTitle) => `
<div style="font-family: Arial; padding:20px;">
  <h2>VolunteerHub</h2>
  <p>Hello ${name},</p>
  <p>Your application for <b>${eventTitle}</b> has been submitted.</p>
  <p>Status: Pending</p>
</div>
`;

module.exports = applicationSubmitted;
