import {
  fileAuthApi,
  fileTrackApi,
  fileProgressApi,
  fileQuizApi,
  fileAdminApi,
  fileNotificationApi,
  exportAllData,
  resetToInitialData,
} from './fileStorage';

interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  [key: string]: any;
}

// Helper function to simulate async API calls
async function simulateAsync<T>(fn: () => T): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (error) {
        reject(error);
      }
    }, 100); // Small delay to simulate network request
  });
}

// Auth API
export const authApi = {
  async signup(email: string, password: string, firstName: string, lastName: string, role: 'admin' | 'trainee' = 'trainee') {
    return simulateAsync(() => fileAuthApi.signup(email, password, firstName, lastName, role));
  },

  async signin(email: string, password: string) {
    return simulateAsync(() => fileAuthApi.signin(email, password));
  },

  async getUser(accessToken: string) {
    return simulateAsync(() => fileAuthApi.getUser(accessToken));
  },
};

// Track API
export const trackApi = {
  async selectTrack(accessToken: string, trackId: string) {
    return simulateAsync(() => fileTrackApi.selectTrack(accessToken, trackId));
  },

  async getSelectedTrack(accessToken: string) {
    return simulateAsync(() => fileTrackApi.getSelectedTrack(accessToken));
  },
};

// Progress API
export const progressApi = {
  async getProgress(accessToken: string, trackId: string) {
    return simulateAsync(() => fileProgressApi.getProgress(accessToken, trackId));
  },

  async markCourseComplete(accessToken: string, trackId: string, moduleIndex: number, courseIndex: number) {
    return simulateAsync(() => fileProgressApi.markCourseComplete(accessToken, trackId, moduleIndex, courseIndex));
  },
};

// Quiz API
export const quizApi = {
  async submitQuiz(accessToken: string, trackId: string, moduleIndex: number, score: number) {
    return simulateAsync(() => fileQuizApi.submitQuiz(accessToken, trackId, moduleIndex, score));
  },
};

// Admin API
export const adminApi = {
  async getUsers(accessToken: string) {
    return simulateAsync(() => fileAdminApi.getUsers(accessToken));
  },

  async getReports(accessToken: string) {
    return simulateAsync(() => fileAdminApi.getReports(accessToken));
  },
};

// Notification API
export const notificationApi = {
  async sendEmail(accessToken: string, to: string, subject: string, body: string) {
    return simulateAsync(() => fileNotificationApi.sendEmail(accessToken, to, subject, body));
  },
};

// Utility functions for data management
export const dataUtils = {
  exportAllData,
  resetToInitialData,
};