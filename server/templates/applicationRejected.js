const applicationRejected = (name, eventTitle) => `
<div style="font-family: Arial; padding:20px;">
  <h2>VolunteerHub</h2>
  <p>Hello ${name},</p>
  <h2>Application Update</h2>
  <p>Your application for <b>${eventTitle}</b> has been rejected.</p>
</div>
`;

module.exports = applicationRejected;
