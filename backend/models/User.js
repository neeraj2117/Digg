import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    bio: {
      type: String,
      default: "",
    },
    profilePic: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
