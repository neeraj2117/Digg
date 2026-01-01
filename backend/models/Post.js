import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      validate: [arrayLimit, "You can upload max 5 images"],
    },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    isLocal: { type: Boolean, default: false },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

function arrayLimit(val) {
  return val.length <= 5;
}

export default mongoose.model("Post", postSchema);
