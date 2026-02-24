import { projectId } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7e07f5f2`;

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  [key: string]: any;
}

// Helper function to make API calls
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'API request failed');
  }

  return data;
}

// Auth API
export const authApi = {
  async signup(email: string, password: string, firstName: string, lastName: string, role: 'admin' | 'trainee' = 'trainee') {
    return apiCall<ApiResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, firstName, lastName, role }),
    });
  },

  async signin(email: string, password: string) {
    return apiCall<ApiResponse<{ accessToken: string; user: any }>>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async getUser(accessToken: string) {
    return apiCall<ApiResponse<{ user: any }>>('/auth/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

// Track API
export const trackApi = {
  async selectTrack(accessToken: string, trackId: string) {
    return apiCall<ApiResponse>('/tracks/select', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ trackId }),
    });
  },

  async getSelectedTrack(accessToken: string) {
    return apiCall<ApiResponse<{ selectedTrack: string | null }>>('/tracks/selected', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

// Progress API
export const progressApi = {
  async getProgress(accessToken: string, trackId: string) {
    return apiCall<ApiResponse<{ progress: any }>>(`/progress/${trackId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async markCourseComplete(accessToken: string, trackId: string, moduleIndex: number, courseIndex: number) {
    return apiCall<ApiResponse>('/progress/course-complete', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ trackId, moduleIndex, courseIndex }),
    });
  },
};

// Quiz API
export const quizApi = {
  async submitQuiz(accessToken: string, trackId: string, moduleIndex: number, score: number) {
    return apiCall<ApiResponse<{ passed: boolean; progress: any }>>('/quiz/submit', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ trackId, moduleIndex, score }),
    });
  },
};

// Admin API
export const adminApi = {
  async getUsers(accessToken: string) {
    return apiCall<ApiResponse<{ users: any[] }>>('/admin/users', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },

  async getReports(accessToken: string) {
    return apiCall<ApiResponse<{ progressRecords: any[] }>>('/admin/reports', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};

// Notification API
export const notificationApi = {
  async sendEmail(accessToken: string, to: string, subject: string, body: string) {
    return apiCall<ApiResponse>('/notifications/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ to, subject, body }),
    });
  },
};
