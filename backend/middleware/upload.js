import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "digg/posts",
    resource_type: "auto",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "mp4", "mp3", "mov", "avi"],
  },
});

const upload = multer({ storage });

export default upload;
