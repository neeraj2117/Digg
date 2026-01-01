export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  posts: T[];
  total: number;
  page: number;
  limit: number;
}
