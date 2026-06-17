const User = require("../models/User");
const Event = require("../models/Event");
const Application = require("../models/Application");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

const getSummaryReport = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    
    const totalVolunteers = await User.countDocuments({
      role: "volunteer"
    });

    const totalApplications = await Application.countDocuments();

    const approvedApplications = await Application.countDocuments({
      status: "approved"
    });

    const rejectedApplications = await Application.countDocuments({
      status: "rejected"
    });

    const pendingApplications = await Application.countDocuments({
      status: "pending"
    });

    const approvalRate = totalApplications
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0;

    const topEvents = await Application.aggregate([
      {
        $group: {
          _id: "$eventId",
          totalApplications: { $sum: 1 }
        }
      },
      {
        $sort: { totalApplications: -1 }
      },
      {
        $limit: 5
      }
    ]);

    await Event.populate(topEvents, {
      path: "_id",
      select: "title"
    });

    const categoryStats = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);

    const monthlyApplications = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      }
    ]);

    const recentApplications = await Application.find()
      .populate("volunteerId", "name")
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalEvents,
      totalVolunteers,
      totalApplications,
      approvedApplications,
      pendingApplications,
      rejectedApplications,
      approvalRate,
      topEvents,
      categoryStats,
      monthlyApplications,
      recentApplications
    });
  } catch (error) {
    throw error;
  }
};

const exportApplicationsCSV = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    const applications = await Application.find(query)
      .populate("volunteerId", "name email")
      .populate("eventId", "title")
      .sort({ createdAt: -1 });

    const csvData = applications.map((app) => ({
      volunteerName: app.volunteerId?.name || "Anonymous",
      volunteerEmail: app.volunteerId?.email || "N/A",
      eventTitle: app.eventId?.title || "Unknown Event",
      status: app.status,
      appliedDate: new Date(app.createdAt).toLocaleDateString()
    }));

    const fields = [
      "volunteerName",
      "volunteerEmail",
      "eventTitle",
      "status",
      "appliedDate"
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment("applications-report.csv");
    return res.send(csv);
  } catch (error) {
    throw error;
  }
};

const exportPDFReport = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalVolunteers = await User.countDocuments({ role: "volunteer" });
    const totalApplications = await Application.countDocuments();
    const approvedApplications = await Application.countDocuments({ status: "approved" });
    const pendingApplications = await Application.countDocuments({ status: "pending" });
    const rejectedApplications = await Application.countDocuments({ status: "rejected" });

    const approvalRate = totalApplications
      ? Math.round((approvedApplications / totalApplications) * 100)
      : 0;

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

    const recentApplications = await Application.find()
      .populate("volunteerId", "name email")
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    const doc = new PDFDocument({ 
      size: "LETTER",
      margins: { top: 0, bottom: 0, left: 0, right: 0 } 
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="VolunteerHub-Report.pdf"'
    );

    doc.pipe(res);

    // Decorative Top Border Band (Navy Blue)
    doc.rect(0, 0, 612, 8).fill("#1b365d");

    // 1. Header & Logo
    // Modern abstract corporate emblem
    doc.fillColor("#1b365d").rect(50, 38, 5, 28).fill();
    doc.fillColor("#2563eb").rect(58, 44, 5, 22).fill();
    
    doc.fillColor("#1b365d").font("Helvetica-Bold").fontSize(11).text("VOLUNTEERHUB", 72, 38);
    doc.fillColor("#0f172a").font("Helvetica-Bold").fontSize(17).text("Executive Analytics & Performance Report", 72, 50);
    
    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
    
    doc.fillColor("#64748b").font("Helvetica").fontSize(8).text(`Generated: ${dateStr} at ${timeStr}`, 400, 38, { width: 162, align: "right" });
    doc.fillColor("#1b365d").font("Helvetica-Bold").fontSize(8).text("Report Class: Enterprise Summary", 400, 50, { width: 162, align: "right" });
    doc.fillColor("#2e7d32").font("Helvetica-Bold").fontSize(8).text("System Status: Active / Live", 400, 62, { width: 162, align: "right" });

    // 2. Key Metrics Section (MNC Grid Layout)
    doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(8.5).text("KEY PLATFORM METRICS", 50, 95);
    
    // Grid Lines
    doc.strokeColor("#1b365d").lineWidth(1.5).moveTo(50, 108).lineTo(562, 108).stroke();
    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, 168).lineTo(562, 168).stroke();
    
    const cardY = 114;
    const cardW = 116;
    const cardH = 50;
    const cardGap = 16;
    
    const cards = [
      { title: "Total Events", value: totalEvents, sub: "Registered events" },
      { title: "Total Volunteers", value: totalVolunteers, sub: "Active members" },
      { title: "Applications", value: totalApplications, sub: "Total submissions" },
      { title: "Approval Rate", value: `${approvalRate}%`, sub: "Overall percentage" }
    ];
    
    cards.forEach((card, idx) => {
      const cardX = 50 + idx * (cardW + cardGap);
      
      doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(7).text(card.title.toUpperCase(), cardX, cardY);
      doc.fillColor("#1b365d").font("Helvetica-Bold").fontSize(20).text(card.value.toString(), cardX, cardY + 10);
      doc.fillColor("#94a3b8").font("Helvetica").fontSize(7).text(card.sub, cardX, cardY + 32);
      
      if (idx < 3) {
        const divX = cardX + cardW + (cardGap / 2);
        doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(divX, cardY).lineTo(divX, cardY + cardH - 5).stroke();
      }
    });

    // 3. Two-Column Layout (Enrollment Status & Top Events)
    doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(8.5).text("APPLICATION ENROLLMENT STATUS", 50, 185);
    doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(8.5).text("TOP PERFORMING EVENTS", 314, 185);

    const colY = 200;
    const colW = 248;
    
    const approvedW = totalApplications ? (approvedApplications / totalApplications) * colW : 0;
    const pendingW = totalApplications ? (pendingApplications / totalApplications) * colW : 0;
    const rejectedW = totalApplications ? (rejectedApplications / totalApplications) * colW : 0;

    doc.save();
    doc.roundedRect(50, colY, colW, 10, 4).clip();
    if (totalApplications === 0) {
      doc.fillColor("#e2e8f0").rect(50, colY, colW, 10).fill();
    } else {
      if (approvedW > 0) doc.fillColor("#2e7d32").rect(50, colY, approvedW, 10).fill();
      if (pendingW > 0) doc.fillColor("#ed6c02").rect(50 + approvedW, colY, pendingW, 10).fill();
      if (rejectedW > 0) doc.fillColor("#d32f2f").rect(50 + approvedW + pendingW, colY, rejectedW, 10).fill();
    }
    doc.restore();

    const statuses = [
      { label: "Approved Applications", value: approvedApplications, color: "#2e7d32" },
      { label: "Pending Applications", value: pendingApplications, color: "#ed6c02" },
      { label: "Rejected Applications", value: rejectedApplications, color: "#d32f2f" }
    ];

    statuses.forEach((status, idx) => {
      const itemY = colY + 22 + idx * 24;
      const pct = totalApplications ? Math.round((status.value / totalApplications) * 100) : 0;
      
      doc.fillColor(status.color).circle(54, itemY + 6, 3.5).fill();
      
      doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(8).text(status.label, 64, itemY + 2);
      doc.fillColor("#475569").font("Helvetica-Bold").fontSize(8).text(`${status.value} (${pct}%)`, 50, itemY + 2, { width: colW, align: "right" });
      
      doc.strokeColor("#f1f5f9").lineWidth(0.5).moveTo(50, itemY + 17).lineTo(50 + colW, itemY + 17).stroke();
    });

    if (!topEvents || topEvents.length === 0) {
      doc.fillColor("#f8fafc").roundedRect(314, colY, colW, 90, 4).fill();
      doc.strokeColor("#e2e8f0").lineWidth(1).roundedRect(314, colY, colW, 90, 4).stroke();
      doc.fillColor("#94a3b8").font("Helvetica-Oblique").fontSize(8.5).text("No application data available yet.", 330, colY + 38, { width: colW - 32, align: "center" });
    } else {
      topEvents.forEach((event, idx) => {
        const rowY = colY + idx * 24;
        const title = event._id?.title || "Unknown Event";
        const rankStr = (idx + 1).toString().padStart(2, "0");
        
        doc.fillColor("#94a3b8").font("Helvetica-Bold").fontSize(8.5).text(rankStr, 314, rowY + 2);
        doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(8).text(title, 332, rowY + 2, { width: 154, truncate: true });
        
        doc.fillColor("#f1f5f9").roundedRect(496, rowY, 66, 13, 6.5).fill();
        doc.fillColor("#475569").font("Helvetica-Bold").fontSize(7).text(`${event.applications} apps`, 496, rowY + 3.5, { width: 66, align: "center" });
        
        doc.strokeColor("#f1f5f9").lineWidth(0.5).moveTo(314, rowY + 17).lineTo(562, rowY + 17).stroke();
      });
    }

    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, 310).lineTo(562, 310).stroke();

    // 4. Recent Applications Table (Booktabs Style)
    doc.fillColor("#64748b").font("Helvetica-Bold").fontSize(8.5).text("RECENT ENROLLMENT ACTIVITY", 50, 325);
    
    const tableY = 338;
    
    doc.strokeColor("#1b365d").lineWidth(1.5).moveTo(50, tableY).lineTo(562, tableY).stroke();
    doc.strokeColor("#1b365d").lineWidth(1).moveTo(50, tableY + 18).lineTo(562, tableY + 18).stroke();
    
    doc.fillColor("#1b365d").font("Helvetica-Bold").fontSize(7.5);
    doc.text("VOLUNTEER NAME", 55, tableY + 6);
    doc.text("EMAIL ADDRESS", 165, tableY + 6);
    doc.text("EVENT DETAILS", 300, tableY + 6);
    doc.text("STATUS", 455, tableY + 6, { width: 50, align: "left" });
    doc.text("DATE", 510, tableY + 6, { width: 52, align: "right" });

    if (!recentApplications || recentApplications.length === 0) {
      doc.fillColor("#94a3b8").font("Helvetica-Oblique").fontSize(8.5).text("No recent application activity found.", 50, tableY + 35, { width: 512, align: "center" });
    } else {
      recentApplications.forEach((app, idx) => {
        const rowY = tableY + 18 + idx * 24;
        const name = app.volunteerId?.name || "Anonymous";
        const email = app.volunteerId?.email || "N/A";
        const eventTitle = app.eventId?.title || "Unknown Event";
        const status = app.status || "pending";
        const date = app.createdAt ? new Date(app.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        }) : "N/A";
        
        doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(8).text(name, 55, rowY + 6, { width: 105, truncate: true });
        doc.fillColor("#64748b").font("Helvetica").fontSize(7.5).text(email, 165, rowY + 6.5, { width: 130, truncate: true });
        doc.fillColor("#475569").font("Helvetica").fontSize(7.5).text(eventTitle, 300, rowY + 6.5, { width: 150, truncate: true });
        
        let dotColor = "#ed6c02";
        let textColor = "#ed6c02";
        if (status === "approved") {
          dotColor = "#2e7d32";
          textColor = "#2e7d32";
        } else if (status === "rejected") {
          dotColor = "#d32f2f";
          textColor = "#d32f2f";
        }
        
        doc.fillColor(dotColor).circle(458, rowY + 10, 2.5).fill();
        doc.fillColor(textColor).font("Helvetica-Bold").fontSize(7.5).text(status.toUpperCase(), 466, rowY + 6.5);
        
        doc.fillColor("#64748b").font("Helvetica").fontSize(7.5).text(date, 510, rowY + 6.5, { width: 52, align: "right" });
        
        doc.strokeColor("#f1f5f9").lineWidth(0.5).moveTo(50, rowY + 22).lineTo(562, rowY + 22).stroke();
      });
      
      const lastRowY = tableY + 18 + recentApplications.length * 24;
      doc.strokeColor("#1b365d").lineWidth(1.5).moveTo(50, lastRowY - 2).lineTo(562, lastRowY - 2).stroke();
    }

    // 5. Compliance & Info Box
    const noteY = 665;
    doc.fillColor("#f8fafc").roundedRect(50, noteY, 512, 40, 4).fill();
    doc.strokeColor("#e2e8f0").lineWidth(1).roundedRect(50, noteY, 512, 40, 4).stroke();
    doc.strokeColor("#1b365d").lineWidth(3.5).moveTo(51.75, noteY + 1).lineTo(51.75, noteY + 39).stroke();
    
    doc.fillColor("#1b365d").font("Helvetica-Bold").fontSize(7.5).text("REPORT NOTE & SECURITY COMPLIANCE", 62, noteY + 8);
    doc.fillColor("#64748b").font("Helvetica-Oblique").fontSize(7).text(
      "This document contains live platform metrics generated on demand. Volunteer details, contact info, and activity data are confidential and subject to data protection policies. For support or questions, contact management.",
      62,
      noteY + 18,
      { width: 488, lineGap: 1 }
    );

    // 6. Footer
    const footerY = 720;
    doc.strokeColor("#e2e8f0").lineWidth(1).moveTo(50, footerY).lineTo(562, footerY).stroke();
    
    doc.fillColor("#94a3b8").font("Helvetica").fontSize(8);
    doc.text("VolunteerHub Enterprise Reports — Confidential & Private", 50, footerY + 10);
    doc.text("Page 1 of 1", 50, footerY + 10, { width: 512, align: "right" });

    doc.end();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSummaryReport,
  exportApplicationsCSV,
  exportPDFReport
};
