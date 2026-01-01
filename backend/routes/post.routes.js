import express from "express";
import {
  createPost,
  getFeedPosts,
  getSinglePost,
  likePost,
  deletePost,
  dislikePost
} from "../controllers/post.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", authMiddleware, upload.array("images", 5), createPost);
router.get("/", getFeedPosts);
router.get("/:id", authMiddleware, getSinglePost);
router.put("/:id/like", authMiddleware, likePost);
router.put("/:id/dislike", authMiddleware, dislikePost);
router.delete("/:id", authMiddleware, deletePost);

export default router;
