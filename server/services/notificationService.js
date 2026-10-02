const sendEmail = require("../utils/sendEmail");
const applicationSubmitted = require("../templates/applicationSubmitted");
const applicationApproved = require("../templates/applicationApproved");
const applicationRejected = require("../templates/applicationRejected");
const { createNotification } = require("../controllers/notificationController");

const notifyApplicationSubmitted = async (user, event) => {
  try {
    // In-app Notification
    await createNotification(
      user._id,
      "Application Submitted",
      `Your application for "${event.title}" has been received.`,
      "info",
      event._id
    );

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
    // In-app Notification
    await createNotification(
      user._id,
      "Application Approved",
      `Congratulations! Your application for "${event.title}" has been approved.`,
      "success",
      event._id
    );

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
    // In-app Notification
    await createNotification(
      user._id,
      "Application Update",
      `Your application for "${event.title}" was not approved at this time.`,
      "warning",
      event._id
    );

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
