// Initial data for the NC100BW Training Dashboard
// This file serves as the database for the application

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'trainee';
  selectedTrack: string | null;
  createdAt: string;
}

export interface Progress {
  userId: string;
  trackId: string;
  modules: {
    [key: number]: {
      completed: boolean;
      courses: {
        [key: number]: {
          completed: boolean;
          completedAt?: string;
        };
      };
      quizScore?: number;
      quizPassed: boolean;
      quizAttempts: number;
    };
  };
  overallProgress: number;
  updatedAt: string;
}

export interface Session {
  userId: string;
  accessToken: string;
  createdAt: string;
}

// Initial users - includes default admin account
export const initialUsers: User[] = [
  {
    id: "admin-001",
    email: "admin@nc100bw.org",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    selectedTrack: null,
    createdAt: "2024-01-15T00:00:00.000Z"
  }
];

// Initial progress records (empty)
export const initialProgress: Progress[] = [];

// Initial sessions (empty)
export const initialSessions: Session[] = [];
