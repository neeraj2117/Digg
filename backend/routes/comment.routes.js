import express from "express";
import {
  addComment,
  getPostComments,
  likeComment,
  deleteComment
} from "../controllers/comment.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/:postId", authMiddleware, addComment);
router.get("/:postId", authMiddleware, getPostComments);
router.put("/:id/like", authMiddleware, likeComment);
router.delete("/:id", authMiddleware, deleteComment);

export default router;
