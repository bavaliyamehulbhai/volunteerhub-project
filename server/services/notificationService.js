const sendEmail = require("../utils/sendEmail");
const applicationSubmitted = require("../templates/applicationSubmitted");
const applicationApproved = require("../templates/applicationApproved");
const applicationRejected = require("../templates/applicationRejected");

const notifyApplicationSubmitted = async (user, event) => {
  try {
    const html = applicationSubmitted(user.name, event.title);
    await sendEmail({
      to: user.email,
      subject: "Application Submitted - VolunteerHub",
      html
    });
  } catch (error) {
    console.log("Email Error:", error);
  }
};

const notifyApplicationApproved = async (user, event) => {
  try {
    const html = applicationApproved(user.name, event.title);
    await sendEmail({
      to: user.email,
      subject: "Application Approved - VolunteerHub",
      html
    });
  } catch (error) {
    console.log("Email Error:", error);
  }
};

const notifyApplicationRejected = async (user, event) => {
  try {
    const html = applicationRejected(user.name, event.title);
    await sendEmail({
      to: user.email,
      subject: "Application Update - VolunteerHub",
      html
    });
  } catch (error) {
    console.log("Email Error:", error);
  }
};

module.exports = {
  notifyApplicationSubmitted,
  notifyApplicationApproved,
  notifyApplicationRejected
};
