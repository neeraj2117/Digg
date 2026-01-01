import express from "express";
import {
  getUserProfile,
  getUserPosts,
  followUser,
  unfollowUser,
  updateProfile,
  searchUsers,
  getAnyUserProfile,
  acceptFollowRequest,
  rejectFollowRequest
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/me", authMiddleware, getUserProfile);
router.get("/:id/posts", authMiddleware, getUserPosts);
router.put("/follow/:id", authMiddleware, followUser);
router.put("/accept-request/:id", authMiddleware, acceptFollowRequest);
router.put("/reject-request/:id", authMiddleware, rejectFollowRequest);
router.put("/unfollow/:id", authMiddleware, unfollowUser);
router.put("/me", authMiddleware, updateProfile);
router.get("/search", authMiddleware, searchUsers);
router.get("/profile/:id", authMiddleware, getAnyUserProfile);

export default router;
