const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["admin", "volunteer"],
      default: "volunteer"
    },

    phone: {
      type: String
    },

    city: {
      type: String
    },

    profileImage: {
      type: String
    },

    skills: [
      {
        type: String
      }
    ],

    mfaEnabled: {
      type: Boolean,
      default: false
    },

    mfaSecret: {
      type: String
    },

    mfaSecretExpires: {
      type: Date
    },

    securityQuestions: [
      {
        question: { type: String },
        answerHash: { type: String }
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);