const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedFirstAdmin = async () => {
  try {
    const adminEmail = "mehulbhaibavaliya8@gmail.com";
    const adminExists = await User.findOne({ email: adminEmail });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Mehul@VolunteerhubAdmin123", salt);

    if (!adminExists) {
      await User.create({
        name: "System Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        city: "Mumbai",
        skills: ["Management", "Leadership"]
      });
      console.log("Seeded first admin account successfully.");
    } else {
      // Force update role and password to guarantee login works for these details
      adminExists.role = "admin";
      adminExists.password = hashedPassword;
      await adminExists.save();
      console.log("Enforced admin role and credentials for first admin.");
    }
  } catch (error) {
    console.error("Error seeding first admin:", error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGO_URL);

    console.log(
      `MongoDB Connected: ${conn.connection.host}`
    );
    
    // Seed the default system admin
    await seedFirstAdmin();
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;