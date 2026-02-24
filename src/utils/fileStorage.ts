// File-based storage system that syncs with TypeScript data files and localStorage

import { 
  initialUsers, 
  initialProgress, 
  initialSessions,
  User,
  Progress,
  Session
} from '../data/initialData';

// Initialize data from TypeScript files or localStorage
const initializeData = () => {
  // Try to get from localStorage first, fallback to initial data
  const storedUsers = localStorage.getItem('nc100bw_users');
  const storedProgress = localStorage.getItem('nc100bw_progress');
  const storedSessions = localStorage.getItem('nc100bw_sessions');

  if (!storedUsers) {
    localStorage.setItem('nc100bw_users', JSON.stringify(initialUsers));
  }
  if (!storedProgress) {
    localStorage.setItem('nc100bw_progress', JSON.stringify(initialProgress));
  }
  if (!storedSessions) {
    localStorage.setItem('nc100bw_sessions', JSON.stringify(initialSessions));
  }
};

// Initialize on module load
initializeData();

// Helper functions with localStorage persistence
const getUsers = (): User[] => {
  const users = localStorage.getItem('nc100bw_users');
  return users ? JSON.parse(users) : initialUsers;
};

const saveUsers = (users: User[]) => {
  localStorage.setItem('nc100bw_users', JSON.stringify(users));
  // Also log to console so you can copy and update the data file if needed
  console.log('💾 Users data updated:', JSON.stringify(users, null, 2));
};

const getProgress = (): Progress[] => {
  const progress = localStorage.getItem('nc100bw_progress');
  return progress ? JSON.parse(progress) : initialProgress;
};

const saveProgress = (progress: Progress[]) => {
  localStorage.setItem('nc100bw_progress', JSON.stringify(progress));
  console.log('💾 Progress data updated:', JSON.stringify(progress, null, 2));
};

const getSessions = (): Session[] => {
  const sessions = localStorage.getItem('nc100bw_sessions');
  return sessions ? JSON.parse(sessions) : initialSessions;
};

const saveSessions = (sessions: Session[]) => {
  localStorage.setItem('nc100bw_sessions', JSON.stringify(sessions));
  console.log('💾 Sessions data updated:', JSON.stringify(sessions, null, 2));
};

const generateId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

const generateToken = () => {
  return 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Export data getter for viewing current state
export const exportAllData = () => {
  return {
    users: getUsers(),
    progress: getProgress(),
    sessions: getSessions(),
  };
};

// Reset to initial data from TypeScript files
export const resetToInitialData = () => {
  localStorage.setItem('nc100bw_users', JSON.stringify(initialUsers));
  localStorage.setItem('nc100bw_progress', JSON.stringify(initialProgress));
  localStorage.setItem('nc100bw_sessions', JSON.stringify(initialSessions));
  console.log('🔄 Data reset to initial state from TypeScript files');
};

// Auth API
export const fileAuthApi = {
  signup: (email: string, password: string, firstName: string, lastName: string, role: 'admin' | 'trainee' = 'trainee') => {
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('User with this email already exists');
    }
    
    const newUser: User = {
      id: generateId(),
      email,
      password,
      firstName,
      lastName,
      role,
      selectedTrack: null,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    saveUsers(users);
    
    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    };
  },
  
  signin: (email: string, password: string) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const accessToken = generateToken();
    const sessions = getSessions();
    sessions.push({
      userId: user.id,
      accessToken,
      createdAt: new Date().toISOString(),
    });
    saveSessions(sessions);
    
    return {
      success: true,
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        selectedTrack: user.selectedTrack,
      },
    };
  },
  
  getUser: (accessToken: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.accessToken === accessToken);
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    const users = getUsers();
    const user = users.find(u => u.id === session.userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        selectedTrack: user.selectedTrack,
      },
    };
  },
};

// Track API
export const fileTrackApi = {
  selectTrack: (accessToken: string, trackId: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.accessToken === accessToken);
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === session.userId);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    users[userIndex].selectedTrack = trackId;
    saveUsers(users);
    
    const allProgress = getProgress();
    const existingProgress = allProgress.find(p => p.userId === session.userId && p.trackId === trackId);
    
    if (!existingProgress) {
      const newProgress: Progress = {
        userId: session.userId,
        trackId,
        modules: {
          0: { completed: false, courses: {}, quizPassed: false, quizAttempts: 0 },
        },
        overallProgress: 0,
        updatedAt: new Date().toISOString(),
      };
      allProgress.push(newProgress);
      saveProgress(allProgress);
    }
    
    return {
      success: true,
    };
  },
  
  getSelectedTrack: (accessToken: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.accessToken === accessToken);
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    const users = getUsers();
    const user = users.find(u => u.id === session.userId);
    
    return {
      success: true,
      selectedTrack: user?.selectedTrack || null,
    };
  },
};

// Progress API
export const fileProgressApi = {
  getProgress: (accessToken: string, trackId: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.accessToken === accessToken);
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    const allProgress = getProgress();
    let userProgress = allProgress.find(p => p.userId === session.userId && p.trackId === trackId);
    
    if (!userProgress) {
      userProgress = {
        userId: session.userId,
        trackId,
        modules: {
          0: { completed: false, courses: {}, quizPassed: false, quizAttempts: 0 },
        },
        overallProgress: 0,
        updatedAt: new Date().toISOString(),
      };
      allProgress.push(userProgress);
      saveProgress(allProgress);
    }
    
    return {
      success: true,
      progress: userProgress,
    };
  },
  
  markCourseComplete: (accessToken: string, trackId: string, moduleIndex: number, courseIndex: number) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.accessToken === accessToken);
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    const allProgress = getProgress();
    const progressIndex = allProgress.findIndex(p => p.userId === session.userId && p.trackId === trackId);
    
    if (progressIndex === -1) {
      throw new Error('Progress not found');
    }
    
    const userProgress = allProgress[progressIndex];
    
    if (!userProgress.modules[moduleIndex]) {
      userProgress.modules[moduleIndex] = {
        completed: false,
        courses: {},
        quizPassed: false,
        quizAttempts: 0,
      };
    }
    
    userProgress.modules[moduleIndex].courses[courseIndex] = {
      completed: true,
      completedAt: new Date().toISOString(),
    };
    
    const totalModules = Object.keys(userProgress.modules).length;
    const completedModules = Object.values(userProgress.modules).filter(m => m.completed).length;
    userProgress.overallProgress = Math.round((completedModules / totalModules) * 100);
    userProgress.updatedAt = new Date().toISOString();
    
    allProgress[progressIndex] = userProgress;
    saveProgress(allProgress);
    
    return {
      success: true,
      progress: userProgress,
    };
  },
};

// Quiz API
export const fileQuizApi = {
  submitQuiz: (accessToken: string, trackId: string, moduleIndex: number, score: number) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.accessToken === accessToken);
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    const allProgress = getProgress();
    const progressIndex = allProgress.findIndex(p => p.userId === session.userId && p.trackId === trackId);
    
    if (progressIndex === -1) {
      throw new Error('Progress not found');
    }
    
    const userProgress = allProgress[progressIndex];
    const passed = score >= 70;
    
    if (!userProgress.modules[moduleIndex]) {
      userProgress.modules[moduleIndex] = {
        completed: false,
        courses: {},
        quizPassed: false,
        quizAttempts: 0,
      };
    }
    
    userProgress.modules[moduleIndex].quizScore = score;
    userProgress.modules[moduleIndex].quizPassed = passed;
    userProgress.modules[moduleIndex].quizAttempts += 1;
    
    if (passed) {
      userProgress.modules[moduleIndex].completed = true;
      
      const nextModuleIndex = moduleIndex + 1;
      if (!userProgress.modules[nextModuleIndex]) {
        userProgress.modules[nextModuleIndex] = {
          completed: false,
          courses: {},
          quizPassed: false,
          quizAttempts: 0,
        };
      }
    }
    
    const totalModules = Object.keys(userProgress.modules).length;
    const completedModules = Object.values(userProgress.modules).filter(m => m.completed).length;
    userProgress.overallProgress = Math.round((completedModules / totalModules) * 100);
    userProgress.updatedAt = new Date().toISOString();
    
    allProgress[progressIndex] = userProgress;
    saveProgress(allProgress);
    
    return {
      success: true,
      passed,
      progress: userProgress,
    };
  },
};

// Admin API
export const fileAdminApi = {
  getUsers: (accessToken: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.accessToken === accessToken);
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    const users = getUsers();
    const currentUser = users.find(u => u.id === session.userId);
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }
    
    return {
      success: true,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        selectedTrack: u.selectedTrack,
        createdAt: u.createdAt,
      })),
    };
  },
  
  getReports: (accessToken: string) => {
    const sessions = getSessions();
    const session = sessions.find(s => s.accessToken === accessToken);
    
    if (!session) {
      throw new Error('Unauthorized');
    }
    
    const users = getUsers();
    const currentUser = users.find(u => u.id === session.userId);
    
    if (!currentUser || currentUser.role !== 'admin') {
      throw new Error('Unauthorized - Admin access required');
    }
    
    const allProgress = getProgress();
    
    const progressRecords = allProgress.map(p => {
      const user = users.find(u => u.id === p.userId);
      return {
        userId: p.userId,
        userEmail: user?.email || 'Unknown',
        userName: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        trackId: p.trackId,
        overallProgress: p.overallProgress,
        modules: p.modules,
        updatedAt: p.updatedAt,
      };
    });
    
    return {
      success: true,
      progressRecords,
    };
  },
};

// Notification API
export const fileNotificationApi = {
  sendEmail: (accessToken: string, to: string, subject: string, body: string) => {
    console.log('📧 Email sent:', { to, subject, body });
    return {
      success: true,
      message: 'Email notification simulated (file storage mode)',
    };
  },
};