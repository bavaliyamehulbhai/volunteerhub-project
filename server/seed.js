const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Event = require("./models/Event");
const Application = require("./models/Application");

dotenv.config();

const eventsData = [
  {
    title: "Beach Cleanup Drive",
    description: "Join us for our annual beach cleanup drive. Help us keep our oceans clean and protect marine life. We will provide all necessary equipment including gloves and trash bags.",
    location: "Mumbai Beach",
    category: "Environment",
    eventDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80",
    requiredVolunteers: 50,
    requiredSkills: ["Teamwork", "Physical Stamina"]
  },
  {
    title: "Teaching Underprivileged Kids",
    description: "Spend your weekend teaching basic math and English to underprivileged children. Your 2 hours can make a big difference in their future.",
    location: "Delhi Community Center",
    category: "Education",
    eventDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80",
    requiredVolunteers: 20,
    requiredSkills: ["Teaching", "Patience", "Communication"]
  },
  {
    title: "Healthcare Camp Assistant",
    description: "We need volunteers to help manage crowds and assist doctors in our upcoming free healthcare camp for the elderly.",
    location: "Bangalore Central Clinic",
    category: "Healthcare",
    eventDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80",
    requiredVolunteers: 15,
    requiredSkills: ["Management", "Empathy", "First Aid"]
  },
  {
    title: "Community Food Drive",
    description: "Help us pack and distribute food to homeless shelters around the city. A small act of kindness goes a long way.",
    location: "Pune Townhall",
    category: "Community",
    eventDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80",
    requiredVolunteers: 30,
    requiredSkills: ["Logistics", "Teamwork"]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected for Seeding...");

    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("No admin user found. Start the server first to auto-create admin.");
      process.exit(1);
    }

    await Event.deleteMany({});
    await Application.deleteMany({});
    console.log("Cleared old events and applications...");

    const eventsWithAdmin = eventsData.map(event => ({
      ...event,
      createdBy: adminUser._id
    }));

    await Event.insertMany(eventsWithAdmin);
    console.log("New Premium Events seeded successfully!");

    process.exit();
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
