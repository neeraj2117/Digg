import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

// export const createPost = async (req, res) => {
//   try {
//     // Check if files exist first
//     if (!req.files || req.files.length === 0) {
//       console.log("No files received");
//     } else {
//       console.log("Files received count:", req.files.length);
//     }

//     const { title, description, category } = req.body;

//     // Safety check for req.body
//     if (!title || !description || !category) {
//       return res
//         .status(400)
//         .json({ message: "Title, description, and category are required" });
//     }

//     const images = req.files?.map((file) => file.path) || [];

//     const newPost = new Post({
//       user: req.userId,
//       title,
//       description,
//       category,
//       images,
//     });

//     await newPost.save();

//     const populatedPost = await Post.findById(newPost._id)
//       .populate("user", "username profilePic")
//       .populate("likes", "username");

//     res.status(201).json({
//       message: "Post created successfully",
//       post: populatedPost,
//     });
//   } catch (error) {
//     console.error("SERVER CRASH ERROR:", error);
//     console.error(error);
//     res.status(500).json({ message: "Failed to create post" });
//   }
// };

export const createPost = async (req, res) => {
  try {
    // 1. Extract ALL sent fields from req.body
    const { title, description, category, city, state, country, isLocal } =
      req.body;

    if (!title || !description || !category) {
      return res
        .status(400)
        .json({ message: "Title, description, and category are required" });
    }

    const images = req.files?.map((file) => file.path) || [];

    // 2. Add them to the new Post document
    const newPost = new Post({
      user: req.userId,
      title,
      description,
      category,
      images,
      city, // Added
      state, // Added
      country, // Added
      // Convert string "true"/"false" from FormData back to Boolean
      isLocal: isLocal === "true" || isLocal === true,
    });

    await newPost.save();

    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "username profilePic")
      .populate("likes", "username");

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const { category, location, limit = 50, page = 1 } = req.query;
    const skip = (page - 1) * limit;

    let filter = {};

    // 1. Category Filter
    if (category && category !== "Trending") {
      filter.category = category;
    }

    // 2. SMART LOCATION FILTER (The Key Change)
    if (location) {
      const searchRegex = new RegExp(location, "i"); // 'i' makes it case-insensitive
      filter.$or = [
        { city: searchRegex },
        { state: searchRegex },
        { country: searchRegex },
      ];
    }

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("user", "username profilePic")
      .lean();

    const total = await Post.countDocuments(filter);

    res.json({ posts, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("user", "username profilePic")
      .populate("likes", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch post" });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.userId;
    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasLiked = post.likes.includes(userId);
    const hasDisliked = post.dislikes.includes(userId);

    if (hasLiked) {
      // remove like
      post.likes.pull(userId);
    } else {
      // add like
      post.likes.push(userId);

      // remove dislike if exists
      if (hasDisliked) {
        post.dislikes.pull(userId);
      }

      // ✅ ADD NOTIFICATION LOGIC
      if (post.user.toString() !== userId) {
        await Notification.create({
          recipient: post.user,
          sender: userId,
          type: "like_post",
          post: post._id,
        });
      }
    }

    await post.save();
    res.json({
      success: true,
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Like failed" });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const userId = req.userId;

    if (!post) return res.status(404).json({ message: "Post not found" });

    const hasDisliked = post.dislikes.includes(userId);
    const hasLiked = post.likes.includes(userId);

    if (hasDisliked) {
      post.dislikes.pull(userId);
    } else {
      post.dislikes.push(userId);

      if (hasLiked) {
        post.likes.pull(userId);
      }
    }

    await post.save();

    res.json({
      success: true,
      likes: post.likes.length,
      dislikes: post.dislikes.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Dislike failed" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    await post.deleteOne();

    res.status(200).json({
      success: true,
      postId: req.params.id,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete post" });
  }
};
