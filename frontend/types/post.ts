import { User, UserBasic } from "./user";

export interface Post {
  _id: string;
  title: string;
  description: string;
  category: string;
  images?: string[];
  user: UserBasic;
  comments: Comment[];
  createdAt: string;
  likes: (string | { _id: string })[];    // 👈 Update this line
  dislikes: (string | { _id: string })[]; // Array of User IDs
  isLiked?: boolean;    // Added for UI state
  isDisliked?: boolean; // Added for UI state
  city?: string;  // Added
  state?: string;
}
