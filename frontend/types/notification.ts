export interface Notification {
  _id: string;
  type: 'like_post' | 'comment_post' | 'like_comment' | 'follow';
  sender: {
    _id: string;
    username: string;
    profilePic: string;
  };
  post?: {
    _id: string;
    title: string;
    images: string[];
  };
  content?: string;
  isRead: boolean;
  createdAt: string;
}