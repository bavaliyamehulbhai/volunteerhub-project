const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected"
      ],
      default: "pending"
    },

    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index({
  volunteerId: 1,
  eventId: 1
}, {
  unique: true
});

module.exports = mongoose.model(
  "Application",
  applicationSchema
);