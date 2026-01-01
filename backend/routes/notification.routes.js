import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"; // Ensure this path matches your project
import { 
  getNotifications, 
  markNotificationsRead 
} from "../controllers/notificationController.js";

const router = express.Router();

// Get all notifications for the logged-in user
// GET /api/notifications
router.get("/", authMiddleware, getNotifications);

// Mark all unread notifications as read
// PUT /api/notifications/read
router.put("/read", authMiddleware, markNotificationsRead);

export default router;