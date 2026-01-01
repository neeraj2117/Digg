import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";

export const addComment = async (req, res) => {
  try {
    const { text, parentId } = req.body;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = await Comment.create({
      text,
      user: req.userId,
      post: postId,
      parentId: parentId || null,
    });

    // ✅ ADD THIS LINE: Push the comment ID to the Post's comments array
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    // ✅ ADD NOTIFICATION LOGIC
    // Notify post owner that someone commented
    if (post.user.toString() !== req.userId) {
      await Notification.create({
        recipient: post.user,
        sender: req.userId,
        type: "comment_post",
        post: postId,
        content: text, // Show a snippet of the comment
      });
    }

    // ✅ ADD THIS: If it's a reply, notify the parent comment owner too
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (parentComment && parentComment.user.toString() !== req.userId) {
        await Notification.create({
          recipient: parentComment.user,
          sender: req.userId,
          type: "comment_post", // Or create a 'reply_comment' type
          post: postId,
          content: text,
        });
      }
    }

    const populatedComment = await comment.populate(
      "user",
      "username profilePic"
    );
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

export const getPostComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("user", "username profilePic")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      await Comment.findByIdAndUpdate(id, { $pull: { likes: userId } });
      return res.status(200).json({ message: "Comment unliked", liked: false });
    }

    // ✅ ADD NOTIFICATION LOGIC (Before updating the database)
    await Comment.findByIdAndUpdate(id, { $addToSet: { likes: userId } });

    if (comment.user.toString() !== userId) {
      await Notification.create({
        recipient: comment.user,
        sender: userId,
        type: 'like_comment',
        post: comment.post, // We link to the post so clicking the notification works
        content: comment.text, // Show which comment was liked
      });
    }

    res.status(200).json({ message: "Comment liked", liked: true });
  } catch (error) {
    res.status(500).json({ message: "Failed to like comment" });
  }
};

// export const deleteComment = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.id);

//     if (!comment)
//       return res.status(404).json({ message: "Comment not found" });

//     if (comment.user.toString() !== req.userId) {
//       return res.status(403).json({ message: "Unauthorized" });
//     }

//     await comment.deleteOne();
//     res.status(200).json({ message: "Comment deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete comment" });
//   }
// };

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ ADD THIS: Remove the comment reference from the Post
    await Post.findByIdAndUpdate(comment.post, {
      $pull: { comments: comment._id },
    });

    await comment.deleteOne();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment" });
  }
};
