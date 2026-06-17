const Application = require("../models/Application");
const Event = require("../models/Event");

const applyEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event Not Found"
      });
    }

    if (event.status === "closed") {
      return res.status(400).json({
        message: "Event Closed"
      });
    }

    const availableSeats = event.requiredVolunteers - event.registeredCount;

    if (availableSeats <= 0) {
      return res.status(400).json({
        message: "No Seats Available"
      });
    }

    const existingApplication = await Application.findOne({
      volunteerId: req.user._id,
      eventId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "Already Applied"
      });
    }

    const application = await Application.create({
      volunteerId: req.user._id,
      eventId
    });

    event.registeredCount += 1;
    await event.save();

    const notificationService = require("../services/notificationService");
    await notificationService.notifyApplicationSubmitted(req.user, event);

    res.status(201).json({
      message: "Application Submitted",
      application
    });
  } catch (error) {
    throw error;
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      volunteerId: req.user._id
    })
      .populate("eventId")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    throw error;
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("volunteerId", "name email")
      .populate("eventId", "title location")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    throw error;
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid Status"
      });
    }

    const application = await Application.findById(id).populate("volunteerId").populate("eventId");

    if (!application) {
      return res.status(404).json({
        message: "Application Not Found"
      });
    }

    if (application.status !== "pending") {
      return res.status(400).json({
        message: "Already Processed"
      });
    }

    application.status = status;
    await application.save();

    const notificationService = require("../services/notificationService");
    if (status === "approved") {
      await notificationService.notifyApplicationApproved(application.volunteerId, application.eventId);
    } else if (status === "rejected") {
      await notificationService.notifyApplicationRejected(application.volunteerId, application.eventId);
    }

    res.json({
      message: `Application ${status}`,
      application
    });
  } catch (error) {
    throw error;
  }
};

const getApplicationStats = async (req, res) => {
  try {
    const applications = await Application.find({
      volunteerId: req.user._id
    });

    const applied = applications.length;
    const approved = applications.filter(app => app.status === "approved").length;
    const pending = applications.filter(app => app.status === "pending").length;
    const rejected = applications.filter(app => app.status === "rejected").length;

    res.json({
      applied,
      approved,
      pending,
      rejected
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  applyEvent,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationStats
};