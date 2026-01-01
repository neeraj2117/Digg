import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Owner of post
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },    // Person who liked/commented
  type: { 
    type: String, 
    enum: ['like_post', 'comment_post', 'like_comment', 'follow'], 
    required: true 
  },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Reference to the post
  content: { type: String }, // Optional: snippet of the comment
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Notification", NotificationSchema);