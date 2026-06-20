const User = require("../models/User");
const Event = require("../models/Event");
const Application = require("../models/Application");
const AdminRequest = require("../models/AdminRequest");

const getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    
    const totalVolunteers = await User.countDocuments({
      role: "volunteer"
    });

    const totalApplications = await Application.countDocuments();

    const approvedApplications = await Application.countDocuments({
      status: "approved"
    });

    const approvalRate = totalApplications
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0;

    // Top Events
    const topEvents = await Application.aggregate([
      {
        $group: {
          _id: "$eventId",
          applications: { $sum: 1 }
        }
      },
      {
        $sort: { applications: -1 }
      },
      {
        $limit: 5
      }
    ]);
    await Event.populate(topEvents, {
      path: "_id",
      select: "title"
    });

    // Application Status
    const applicationStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Category Stats
    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 }
        }
      }
    ]);

    // Trends
    const trends = await Application.aggregate([
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.month": 1 }
      }
    ]);

    const formattedTrends = trends.map(t => ({
      month: t._id.month,
      count: t.count
    }));

    res.json({
      totalEvents,
      totalVolunteers,
      totalApplications,
      approvedApplications,
      approvalRate,
      topEvents,
      applicationStatus,
      categoryStats,
      trends: formattedTrends
    });
  } catch (error) {
    throw error;
  }
};

const getAnalytics = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalApplications = await Application.countDocuments();
    const approvedApplications = await Application.countDocuments({ status: "approved" });

    const approvalRate = totalApplications
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0;

    // Growth Percentage calculation: Compare current month vs previous month
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const currentMonthCount = await Application.countDocuments({
      createdAt: { $gte: startOfCurrentMonth }
    });
    const prevMonthCount = await Application.countDocuments({
      createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth }
    });

    let monthlyGrowth = 0;
    if (prevMonthCount === 0) {
      monthlyGrowth = currentMonthCount > 0 ? 100 : 0;
    } else {
      monthlyGrowth = Math.round(((currentMonthCount - prevMonthCount) / prevMonthCount) * 100);
    }

    // Monthly Trends
    const trends = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyApplications = trends.map(t => {
      const monthStr = monthNames[t._id.month - 1] || `Month ${t._id.month}`;
      return {
        month: `${monthStr} ${t._id.year}`,
        applications: t.count
      };
    });

    // Application Status Chart Data
    const statusData = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const applicationStatus = statusData.map(s => ({
      name: s._id.charAt(0).toUpperCase() + s._id.slice(1),
      value: s.count
    }));

    // Top Categories
    const categoriesList = ["Education", "Healthcare", "Environment", "Community", "Sports"];
    const categoryStats = await Promise.all(
      categoriesList.map(async (cat) => {
        const eventCount = await Event.countDocuments({ category: cat });
        const eventsInCat = await Event.find({ category: cat }).select("_id");
        const eventIds = eventsInCat.map(e => e._id);
        const applicationsCount = await Application.countDocuments({ eventId: { $in: eventIds } });
        return {
          category: cat,
          eventCount,
          applicationsCount
        };
      })
    );
    categoryStats.sort((a, b) => b.applicationsCount - a.applicationsCount);

    // Top Active Volunteers
    const activeVolunteers = await Application.aggregate([
      {
        $group: {
          _id: "$volunteerId",
          applicationCount: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { applicationCount: -1 }
      },
      {
        $limit: 5
      }
    ]);
    await User.populate(activeVolunteers, {
      path: "_id",
      select: "name email profileImage city"
    });

    const formattedActiveVolunteers = activeVolunteers
      .filter(v => v._id)
      .map(v => ({
        user: v._id,
        applicationCount: v.applicationCount,
        approvedCount: v.approvedCount
      }));

    // Top Events (Performance)
    const topEvents = await Application.aggregate([
      {
        $group: {
          _id: "$eventId",
          applicationCount: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          }
        }
      },
      {
        $sort: { applicationCount: -1 }
      },
      {
        $limit: 5
      }
    ]);
    await Event.populate(topEvents, {
      path: "_id",
      select: "title category eventDate requiredVolunteers registeredCount image"
    });

    const formattedTopEvents = topEvents
      .filter(e => e._id)
      .map(e => ({
        event: e._id,
        applicationCount: e.applicationCount,
        approvedCount: e.approvedCount
      }));

    // Recent Activity Feed
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("volunteerId", "name email profileImage")
      .populate("eventId", "title category");

    const formattedRecentApplications = recentApplications
      .filter(app => app.volunteerId && app.eventId)
      .map(app => ({
        _id: app._id,
        volunteer: app.volunteerId,
        event: app.eventId,
        status: app.status,
        appliedAt: app.appliedAt || app.createdAt
      }));

    res.json({
      totalEvents,
      totalVolunteers,
      totalApplications,
      approvedApplications,
      approvalRate,
      monthlyGrowth,
      monthlyApplications,
      applicationStatus,
      categoryStats,
      activeVolunteers: formattedActiveVolunteers,
      topEvents: formattedTopEvents,
      recentApplications: formattedRecentApplications
    });
  } catch (error) {
    throw error;
  }
};

const getVolunteers = async (req, res) => {
  try {
    const volunteers = await User.aggregate([
      { $match: { role: "volunteer" } },
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "volunteerId",
          as: "applications"
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          city: 1,
          profileImage: 1,
          skills: 1,
          createdAt: 1,
          totalApplications: { $size: "$applications" },
          approvedApplications: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: { $eq: ["$$app.status", "approved"] }
              }
            }
          },
          pendingApplications: {
            $size: {
              $filter: {
                input: "$applications",
                as: "app",
                cond: { $eq: ["$$app.status", "pending"] }
              }
            }
          }
        }
      },
      { $sort: { name: 1 } }
    ]);
    res.json(volunteers);
  } catch (error) {
    throw error;
  }
};

const getAdminRequests = async (req, res) => {
  try {
    const requests = await AdminRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveAdminRequest = async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Admin request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }

    const userExists = await User.findOne({ email: request.email });
    if (userExists) {
      request.status = "rejected";
      await request.save();
      return res.status(400).json({ message: "User with this email already exists. Request automatically rejected." });
    }

    // Create user in User collection
    await User.create({
      name: request.name,
      email: request.email,
      password: request.password, // Password is already hashed
      role: "admin",
      city: "Mumbai",
      skills: ["Management"]
    });

    request.status = "approved";
    await request.save();

    res.json({ message: "Admin request approved and account created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const rejectAdminRequest = async (req, res) => {
  try {
    const request = await AdminRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Admin request not found" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: `Request already ${request.status}` });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Admin request rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAnalytics,
  getVolunteers,
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest
};


