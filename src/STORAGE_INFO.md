# Storage System - localStorage Mode

## ⚠️ IMPORTANT: Supabase is DISABLED

This application uses **localStorage** for all data storage. The Supabase integration has been completely replaced.

### Ignore Supabase Deployment Errors

If you see errors like:
```
Error while deploying: XHR for "/api/integrations/supabase/.../edge_functions/make-server/deploy" failed with status 403
```

**You can safely ignore these errors.** They occur because Figma Make tries to deploy protected Supabase edge function files, but the application does not use Supabase at all.

## How the App Works

✅ **All data is stored in browser localStorage**  
✅ **No external backend required**  
✅ **Works completely offline**  
✅ **No API keys or credentials needed**  

## Default Admin Login

- **Email:** `admin@nc100bw.org`
- **Password:** `admin123`

## Data Storage Location

Open your browser's DevTools (F12) → Application tab → Local Storage

You'll see three keys:
- `nc100bw_users` - User accounts
- `nc100bw_progress` - Training progress  
- `nc100bw_sessions` - Active login sessions

## Implementation Files

### Active Files (Used by the app):
- `/utils/localStorage.ts` - Complete localStorage backend
- `/utils/api.ts` - API layer that uses localStorage

### Disabled Files (Ignored by the app):
- `/utils/supabase/client.tsx` - Stubbed out, not used
- `/utils/supabase/info.tsx` - Empty, not used
- `/supabase/functions/*` - Protected system files, ignored

## How to Use

1. **Login**: Use the default admin credentials above
2. **Create Users**: Admin can create trainee accounts
3. **Track Progress**: All progress is saved automatically to localStorage
4. **Generate Reports**: Admin can view all trainee progress
5. **Certificates**: Generate completion certificates

## Data Persistence

- Data persists across browser sessions
- Data is specific to each browser/device
- Clearing browser cache will reset data to defaults
- To backup data: Copy the localStorage values from DevTools

## Troubleshooting

### "Supabase deployment error"
→ **Ignore it.** The app doesn't use Supabase.

### "Lost my data"
→ Check if you cleared browser cache/cookies.  
→ Data is stored per-browser, so different browsers have different data.

### "Can't login"
→ Try the default admin account above.  
→ Check browser console for errors.

### "Need to reset everything"
→ Open browser console and run: `localStorage.clear()`  
→ Refresh the page to restore default admin account.

## For Developers

The entire backend logic is in `/utils/localStorage.ts`. It provides:

- User authentication (signup, signin, sessions)
- Track selection and management  
- Course progress tracking
- Quiz submission and scoring (70% pass requirement)
- Sequential module unlocking
- Admin user management
- Progress reporting

All functions simulate async behavior to match the original Supabase API interface.
