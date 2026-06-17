const express =
require("express");

const router =
express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getRecommendedEvents
} = require(
 "../controllers/eventController"
);

const {
 protect
} = require(
 "../middleware/authMiddleware"
);

const adminOnly =
require(
 "../middleware/roleMiddleware"
);

router.get(
 "/",
 getEvents
);

router.get(
 "/recommended",
 protect,
 getRecommendedEvents
);

router.get(
 "/:id",
 getEventById
);

router.post(
 "/",
 protect,
 adminOnly,
 createEvent
);

router.put(
 "/:id",
 protect,
 adminOnly,
 updateEvent
);

router.delete(
 "/:id",
 protect,
 adminOnly,
 deleteEvent
);

module.exports = router;