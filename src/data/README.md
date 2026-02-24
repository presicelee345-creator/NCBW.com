# Data Storage Files

This directory contains the TypeScript data files that serve as the database for the NC100BW Training Dashboard.

## Files

### `initialData.ts`
Contains all initial data including users, progress, and sessions.

**Default Admin Account:**
- Email: `admin@nc100bw.org`
- Password: `admin123`

**Exported Data:**
- `initialUsers` - Array of user accounts
- `initialProgress` - Array of progress records (empty initially)
- `initialSessions` - Array of active sessions (empty initially)

**User Structure:**
```typescript
{
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'trainee';
  selectedTrack: string | null;
  createdAt: string;
}
```

**Progress Structure:**
```typescript
{
  userId: string;
  trackId: string;
  modules: {
    [moduleIndex: number]: {
      completed: boolean;
      courses: {
        [courseIndex: number]: {
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
```

**Session Structure:**
```typescript
{
  userId: string;
  accessToken: string;
  createdAt: string;
}
```

## How It Works

1. **Initial Load**: Data is loaded from `/data/initialData.ts` when the app starts
2. **Runtime Storage**: Changes are saved to browser localStorage with key prefix `nc100bw_`
3. **Console Logging**: All data changes are logged to the browser console with 💾 emoji
4. **Persistence**: Data persists in localStorage between sessions

## Viewing Live Data

Open your browser console and run:

```javascript
// View all current data
console.log(dataUtils.exportAllData());

// Reset to initial TypeScript file data
dataUtils.resetToInitialData();
```

Or check localStorage directly:
- `nc100bw_users` - Current users
- `nc100bw_progress` - Current progress
- `nc100bw_sessions` - Active sessions

## Updating Data Files

To update the initial data:

1. Open browser console
2. Run: `console.log(JSON.stringify(dataUtils.exportAllData(), null, 2))`
3. Copy the output for the data you want
4. Update `/data/initialData.ts` with the new data
5. Refresh the app or run `dataUtils.resetToInitialData()`

## Data Management Console Commands

```javascript
// Import the utilities (in browser console after app loads)
import { dataUtils } from './utils/api';

// Export all current data
const allData = dataUtils.exportAllData();
console.log(JSON.stringify(allData, null, 2));

// Reset to initial state
dataUtils.resetToInitialData();

// Clear all data
localStorage.clear();
```

## Storage Locations

**File System (Figma):**
- `/data/initialData.ts` - TypeScript file with all initial data

**Browser (Runtime):**
- `localStorage['nc100bw_users']`
- `localStorage['nc100bw_progress']`
- `localStorage['nc100bw_sessions']`

**Implementation:**
- `/utils/fileStorage.ts` - Storage logic
- `/utils/api.ts` - API layer

## Notes

✅ Data in TypeScript file = initial/default state  
✅ Data in localStorage = current runtime state  
✅ Console logs show all data changes  
✅ TypeScript provides type safety for data structures  
⚠️ Clearing browser data will reset to TypeScript file state  
⚠️ TypeScript file is read-only at runtime (initial state only)