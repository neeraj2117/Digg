import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.userId })
      .sort({ createdAt: -1 })
      .populate("sender", "username profilePic") // To show who liked/commented
      .populate("post", "title images")          // To show which post it was
      .limit(50);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.userId, isRead: false },
      { $set: { isRead: true } }
    );
    res.status(200).json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notifications" });
  }
};