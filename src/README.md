# National Coalition of 100 Black Women - Training Dashboard

## Overview
A comprehensive training dashboard for the Queen City Metropolitan Chapter featuring user authentication, progress tracking, sequential module locking, quiz functionality, and admin tools.

## Features

### Authentication & User Management
- **User Signup**: Create new trainee or admin accounts with email/password
- **User Login**: Secure authentication with Supabase
- **Role-Based Access**: Separate views for trainees and administrators
- **Session Management**: Automatic session handling and persistence

### Trainee Features
1. **Track Selection**: Choose one leadership track from nine available positions
2. **Sequential Course Locking**: Complete courses in order within each module
3. **External Course Links**: All course links open in new tabs to platforms (LinkedIn Learning, Coursera, YouTube, Skillshare)
4. **Module Unlocking**: Pass quizzes with 70% or higher to unlock next module
5. **Progress Tracking**: Real-time progress tracking starting at 0%
6. **Certificate Generation**: Automatic certificate generation upon track completion
7. **Profile View**: View personal progress, estimated time spent, and certificates earned

### Admin Features
1. **User Management**: View all trainees, their progress, and quiz scores
2. **Analytics Dashboard**: Track enrollment, completion rates, and certificates awarded
3. **Quiz Management**: Create, edit, and manage quizzes for each module
4. **Certificate Customization**: Design and customize certificates for different tracks
5. **Email Management**: Send reminders, weekly updates, and congratulatory emails
6. **Report Generation**: Export custom reports with trainee data and progress

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **UI**: Custom components with Tailwind CSS v4
- **State Management**: React useState and useEffect hooks
- **Routing**: None required (single-page application)

### Backend
- **Server**: Supabase Edge Functions (Hono web framework)
- **Authentication**: Supabase Auth with email/password
- **Database**: Supabase KV Store for user data and progress
- **API Routes**:
  - `/auth/signup` - Create new user account
  - `/auth/signin` - Login with email/password
  - `/auth/session` - Get current user session
  - `/progress` - Get user progress data
  - `/progress/select-track` - Select a leadership track
  - `/progress/complete-course` - Mark a course as completed
  - `/progress/submit-quiz` - Submit quiz and unlock next module
  - `/admin/users` - Get all users with progress (admin only)
  - `/admin/analytics` - Get system analytics (admin only)

## Data Structure

### User Profile
```javascript
{
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  username: string,
  role: "admin" | "trainee",
  createdAt: string
}
```

### Progress Data
```javascript
{
  userId: string,
  selectedTrack: string | null,
  tracks: {
    [trackId]: {
      progress: number,
      startedAt: string,
      completedAt: string | null
    }
  },
  completedModules: {
    [trackId]: number[] // Array of unlocked module indices
  },
  courseProgress: {
    [trackId]: {
      [moduleIndex]: number[] // Array of completed course indices
    }
  },
  quizScores: {
    [trackId]: {
      [moduleIndex]: number // Quiz score percentage
    }
  },
  certificates: Array<{
    trackId: string,
    userId: string,
    completedAt: string,
    certificateId: string
  }>
}
```

## Leadership Tracks

1. **President** - Strategic thinking, leadership, communication, and conflict-resolution
2. **Vice President** - Project management, team support, and coordination
3. **Second Vice President** - Administrative oversight and event planning
4. **Third Vice President** - Program development and volunteer management
5. **Treasurer** - Financial management, budgeting, and reporting
6. **Financial Secretary** - Financial records and donation management
7. **Corresponding Secretary** - Communication and meeting documentation
8. **Chaplain** - Spiritual guidance and ceremonial events
9. **Parliamentarian** - Parliamentary procedure and governance

Each track contains 5 modules with 5 courses per module and 1 quiz per module (total: 25 courses + 5 quizzes per track).

## Getting Started

### For Trainees
1. **Sign Up**: Click "Create Account" on the login page
2. **Login**: Enter your email and password
3. **Select Track**: Choose your desired leadership position
4. **Complete Courses**: Click on courses to open them in new tabs (complete in order)
5. **Pass Quizzes**: Score 70% or higher to unlock the next module
6. **Earn Certificate**: Complete all 5 modules to receive your certificate

### For Administrators
1. **Login**: Use admin credentials to access the admin dashboard
2. **Monitor Progress**: View all trainees and their progress
3. **Manage Content**: Create/edit quizzes and certificates
4. **Send Emails**: Send reminders and updates to trainees
5. **Generate Reports**: Export progress reports and analytics

## Color Scheme
- **Primary Gold**: #c6930a (represents National Coalition of 100 Black Women)
- **Black**: #000000
- **Accent**: Gold gradients and borders throughout the UI

## Notes

- Progress starts at 0% for all new users
- First module in each track is automatically unlocked
- Courses must be completed sequentially within modules
- Quizzes require 70% to pass and unlock the next module
- Course links are external and open in new tabs
- Certificates are automatically generated upon track completion
- Admin users have full access to all features
- Trainee users can only see their selected track

## Future Enhancements

- Social login (Google, Facebook, GitHub)
- Email server integration for automated notifications
- Advanced analytics with charts and graphs
- Mobile app version
- Multi-language support
- Video course embedding
- Discussion forums for trainees
- Peer mentoring features
