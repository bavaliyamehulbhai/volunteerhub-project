const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Education",
        "Healthcare",
        "Environment",
        "Community",
        "Sports"
      ]
    },

    eventDate: {
      type: Date,
      required: true,
    },

    image: {
      type: String,
      default: ""
    },

    requiredVolunteers: {
      type: Number,
      required: true,
      default: 10
    },

    registeredCount: {
      type: Number,
      default: 0
    },

    requiredSkills: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
      lowercase: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

eventSchema.index({
  title: "text",
  location: "text",
  category: "text"
});

module.exports = mongoose.model(
  "Event",
  eventSchema
);