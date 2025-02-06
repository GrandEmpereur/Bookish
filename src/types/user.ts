import { Post } from './post';
import { UserGenre } from './userGenre';
import { UserPreference } from './userPreference';

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  bio?: string;
  location?: string;
  profilePicturePath?: string;
  preferredGenres?: string[];
  readingHabit?: string;
  role?: string;
  profileVisibility?: string;
}

export interface User {
  id: string;
  username: string;
  profile: UserProfile;
  createdAt: string;
}


export interface UserResponse {
    status: string;
    message?: string;
    data: User;
}

export interface UsersResponse {
    data: User[];
}
