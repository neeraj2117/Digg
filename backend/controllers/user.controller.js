import User from "../models/User.js";
import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    .select("-password")
    .populate("followRequests", "username profilePic bio");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.id })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePic");

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// export const followUser = async (req, res) => {
//   try {
//     const targetId = req.params.id;
//     const myId = req.userId;

//     if (myId === targetId) return res.status(400).json({ message: "You can't follow yourself" });

//     const targetUser = await User.findById(targetId);
//     if (!targetUser) return res.status(404).json({ message: "User not found" });

//     // 1. If already following, do nothing or allow unfollow
//     if (targetUser.followers.includes(myId)) {
//       return res.status(400).json({ message: "Already following this user" });
//     }

//     // 2. Check if a request is already pending (Toggle Request)
//     if (targetUser.followRequests.includes(myId)) {
//       await User.findByIdAndUpdate(targetId, { $pull: { followRequests: myId } });
//       return res.status(200).json({ message: "Follow request cancelled", status: "none" });
//     }

//     // 3. Push to followRequests instead of followers
//     await User.findByIdAndUpdate(targetId, { $push: { followRequests: myId } });
    
//     res.status(200).json({ message: "Follow request sent", status: "pending" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const followUser = async (req, res) => {
  try {
    const targetId = req.params.id;
    const myId = req.userId;

    if (myId === targetId) return res.status(400).json({ message: "You can't follow yourself" });

    const targetUser = await User.findById(targetId);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    // --- CASE 1: UNFOLLOW (If already following) ---
    if (targetUser.followers.includes(myId)) {
      // Remove me from their followers
      await User.findByIdAndUpdate(targetId, { $pull: { followers: myId } });
      // Remove them from my following
      await User.findByIdAndUpdate(myId, { $pull: { following: targetId } });
      
      return res.status(200).json({ message: "Unfollowed successfully", status: "none" });
    }

    // --- CASE 2: CANCEL REQUEST (If request is pending) ---
    if (targetUser.followRequests.includes(myId)) {
      await User.findByIdAndUpdate(targetId, { $pull: { followRequests: myId } });
      return res.status(200).json({ message: "Follow request cancelled", status: "none" });
    }

    // --- CASE 3: SEND FOLLOW REQUEST ---
    await User.findByIdAndUpdate(targetId, { $push: { followRequests: myId } });
    
    res.status(200).json({ message: "Follow request sent", status: "pending" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const targetUser = await User.findById(req.params.id);

    if (!user.following.includes(req.params.id)) {
      return res.status(400).json({ message: "Not following this user" });
    }

    await user.updateOne({ $pull: { following: req.params.id } });
    await targetUser.updateOne({ $pull: { followers: req.userId } });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, bio, image, city, state, country } = req.body;

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let imageUrl;

    if (image) {
      const upload = await cloudinary.uploader.upload(image, {
        folder: "profiles",
      });

      imageUrl = upload.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        username,
        bio,
        city,
        state,
        country,  
        ...(imageUrl && { profilePic: imageUrl }),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    let users;

    if (q) {
      // Search for users where username matches the query (case-insensitive)
      users = await User.find({
        username: { $regex: q, $options: "i" },
        _id: { $ne: req.userId } // Don't show the logged-in user in search results
      })
      .select("username profilePic bio followers following")
      .limit(20);
    } else {
      // Initial state: Fetch 5 random/latest users as suggestions
      users = await User.find({ _id: { $ne: req.userId } })
        .select("username profilePic bio")
        .limit(5);
    }

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("SEARCH USERS ERROR:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};

export const getAnyUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const acceptFollowRequest = async (req, res) => {
  try {
    const requestId = req.params.id; // The user who sent the request
    const myId = req.userId; // The user accepting it

    const me = await User.findById(myId);

    if (!me.followRequests.includes(requestId)) {
      return res.status(400).json({ message: "No such request found" });
    }

    // 1. Remove from followRequests
    // 2. Add to my followers
    await User.findByIdAndUpdate(myId, { 
      $pull: { followRequests: requestId },
      $push: { followers: requestId } 
    });

    // 3. Add me to the sender's following list
    await User.findByIdAndUpdate(requestId, { $push: { following: myId } });

    res.status(200).json({ message: "Request accepted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const rejectFollowRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const myId = req.userId;

    await User.findByIdAndUpdate(myId, { $pull: { followRequests: requestId } });

    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

