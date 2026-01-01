export interface User {
  _id: string;
  username: string;
  email?: string;

  profilePic?: string;
  bio?: string;

  followers: string[];   // userIds
  following: string[];   // userIds
  followRequests: string[];

  city?: string;  
  state?: string; 
  country?: string;

  createdAt: string;
}

export interface UserBasic {
  _id: string;
  username: string;
  profilePic?: string;
}
