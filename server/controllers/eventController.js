const Event = require("../models/Event");
const calculateSkillMatch = require("../utils/skillMatch");

// API 1 - Create Event (Admin Only)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      eventDate,
      image,
      requiredVolunteers,
      requiredSkills
    } = req.body;

    const event = await Event.create({
      title,
      description,
      location,
      category,
      eventDate,
      image,
      requiredVolunteers,
      requiredSkills,
      createdBy: req.user._id
    });

    res.status(201).json(event);
  } catch (error) {
    throw error;
  }
};

// API 3 - Get All Events with Advanced Search + Filters (Public Route)
const getEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      page = 1
    } = req.query;

    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i"
      };
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i"
      };
    }

    const limit = 6;
    const skip = (page - 1) * limit;

    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    throw error;
  }
};

// API 4 - Get Single Event (Public Route)
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event Not Found"
      });
    }

    res.json(event);
  } catch (error) {
    throw error;
  }
};

// API 5 - Update Event (Admin Only)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event Not Found"
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    throw error;
  }
};

// API 6 - Delete Event (Admin Only)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event Not Found"
      });
    }

    await event.deleteOne();

    res.json({
      message: "Event Deleted Successfully"
    });
  } catch (error) {
    throw error;
  }
};

const getRecommendedEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: "open" });

    const recommendations = events.map((event) => {
      const result = calculateSkillMatch(
        req.user.skills || [],
        event.requiredSkills || []
      );

      return {
        ...event.toObject(),
        matchScore: result.score,
        matchedSkills: result.matchedSkills
      };
    });

    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.json(recommendations);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getRecommendedEvents
};
