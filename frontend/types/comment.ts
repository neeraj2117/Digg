import { User } from "./user";

export interface Comment {
  _id: string;
  text: string;
  user: User;
  postId: string;
  likes: string[]; 
  createdAt: string;
}
