import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Create Supabase client
const getSupabaseClient = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-7e07f5f2/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== AUTHENTICATION ROUTES ==========

// Sign up endpoint
app.post("/make-server-7e07f5f2/auth/signup", async (c) => {
  try {
    const { email, password, firstName, lastName, role = "trainee" } = await c.req.json();
    
    const supabase = getSupabaseClient();
    
    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since we don't have email server configured
      user_metadata: { firstName, lastName, role }
    });
    
    if (authError) {
      console.error("Signup error:", authError);
      return c.json({ error: authError.message }, 400);
    }
    
    const userId = authData.user.id;
    
    // Store user profile in KV store
    await kv.set(`user:${userId}:profile`, {
      email,
      firstName,
      lastName,
      role,
      selectedTrack: null,
      createdAt: new Date().toISOString()
    });
    
    return c.json({ 
      success: true, 
      user: { id: userId, email, firstName, lastName, role }
    });
  } catch (error) {
    console.error("Signup error:", error);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

// Sign in endpoint
app.post("/make-server-7e07f5f2/auth/signin", async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    const supabase = getSupabaseClient();
    
    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Signin error:", error);
      return c.json({ error: "Invalid email or password" }, 401);
    }
    
    const userId = data.user.id;
    
    // Get user profile
    const profile = await kv.get(`user:${userId}:profile`);
    
    return c.json({ 
      success: true,
      accessToken: data.session.access_token,
      user: {
        id: userId,
        email: data.user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error("Signin error:", error);
    return c.json({ error: "Failed to sign in" }, 500);
  }
});

// Get current user (requires auth)
app.get("/make-server-7e07f5f2/auth/user", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const profile = await kv.get(`user:${user.id}:profile`);
    
    return c.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error("Get user error:", error);
    return c.json({ error: "Failed to get user" }, 500);
  }
});

// ========== TRACK SELECTION ROUTES ==========

// Select a track
app.post("/make-server-7e07f5f2/tracks/select", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { trackId } = await c.req.json();
    
    // Update user profile with selected track
    const profile = await kv.get(`user:${user.id}:profile`);
    profile.selectedTrack = trackId;
    await kv.set(`user:${user.id}:profile`, profile);
    
    // Initialize progress for this track if it doesn't exist
    const progressKey = `user:${user.id}:progress:${trackId}`;
    const existingProgress = await kv.get(progressKey);
    
    if (!existingProgress) {
      await kv.set(progressKey, {
        trackId,
        completedModules: [],
        completedCourses: {},
        quizScores: {},
        overallProgress: 0,
        startedAt: new Date().toISOString()
      });
    }
    
    return c.json({ success: true, selectedTrack: trackId });
  } catch (error) {
    console.error("Track selection error:", error);
    return c.json({ error: "Failed to select track" }, 500);
  }
});

// Get selected track
app.get("/make-server-7e07f5f2/tracks/selected", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const profile = await kv.get(`user:${user.id}:profile`);
    
    return c.json({ 
      success: true, 
      selectedTrack: profile?.selectedTrack || null 
    });
  } catch (error) {
    console.error("Get selected track error:", error);
    return c.json({ error: "Failed to get selected track" }, 500);
  }
});

// ========== PROGRESS TRACKING ROUTES ==========

// Get progress for a track
app.get("/make-server-7e07f5f2/progress/:trackId", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const trackId = c.req.param("trackId");
    const progressKey = `user:${user.id}:progress:${trackId}`;
    const progress = await kv.get(progressKey);
    
    if (!progress) {
      // Initialize with empty progress
      const newProgress = {
        trackId,
        completedModules: [],
        completedCourses: {},
        quizScores: {},
        overallProgress: 0,
        startedAt: new Date().toISOString()
      };
      await kv.set(progressKey, newProgress);
      return c.json({ success: true, progress: newProgress });
    }
    
    return c.json({ success: true, progress });
  } catch (error) {
    console.error("Get progress error:", error);
    return c.json({ error: "Failed to get progress" }, 500);
  }
});

// Mark course as completed
app.post("/make-server-7e07f5f2/progress/course-complete", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { trackId, moduleIndex, courseIndex } = await c.req.json();
    const progressKey = `user:${user.id}:progress:${trackId}`;
    const progress = await kv.get(progressKey);
    
    if (!progress) {
      return c.json({ error: "Progress not found" }, 404);
    }
    
    // Mark course as completed
    if (!progress.completedCourses[moduleIndex]) {
      progress.completedCourses[moduleIndex] = [];
    }
    
    if (!progress.completedCourses[moduleIndex].includes(courseIndex)) {
      progress.completedCourses[moduleIndex].push(courseIndex);
    }
    
    await kv.set(progressKey, progress);
    
    return c.json({ success: true, progress });
  } catch (error) {
    console.error("Course completion error:", error);
    return c.json({ error: "Failed to mark course as completed" }, 500);
  }
});

// ========== QUIZ ROUTES ==========

// Submit quiz results
app.post("/make-server-7e07f5f2/quiz/submit", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { trackId, moduleIndex, score } = await c.req.json();
    const progressKey = `user:${user.id}:progress:${trackId}`;
    const progress = await kv.get(progressKey);
    
    if (!progress) {
      return c.json({ error: "Progress not found" }, 404);
    }
    
    // Store quiz score
    progress.quizScores[moduleIndex] = score;
    
    // If score >= 70%, mark module as completed and unlock next
    if (score >= 70) {
      if (!progress.completedModules.includes(moduleIndex)) {
        progress.completedModules.push(moduleIndex);
      }
      
      // Calculate overall progress
      // Progress is based on completed modules
      const totalModules = 5; // Each track has 5 modules
      progress.overallProgress = Math.round((progress.completedModules.length / totalModules) * 100);
    }
    
    await kv.set(progressKey, progress);
    
    return c.json({ 
      success: true, 
      passed: score >= 70,
      progress 
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return c.json({ error: "Failed to submit quiz" }, 500);
  }
});

// ========== ADMIN ROUTES ==========

// Get all users (admin only)
app.get("/make-server-7e07f5f2/admin/users", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    // Check if user is admin
    const profile = await kv.get(`user:${user.id}:profile`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden - Admin access required" }, 403);
    }
    
    // Get all user profiles
    const allProfiles = await kv.getByPrefix("user:");
    const users = allProfiles
      .filter(item => item.key.endsWith(":profile"))
      .map(item => ({
        id: item.key.split(":")[1],
        ...item.value
      }));
    
    return c.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    return c.json({ error: "Failed to get users" }, 500);
  }
});

// Get progress report for all users (admin only)
app.get("/make-server-7e07f5f2/admin/reports", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    // Check if user is admin
    const profile = await kv.get(`user:${user.id}:profile`);
    if (profile?.role !== "admin") {
      return c.json({ error: "Forbidden - Admin access required" }, 403);
    }
    
    // Get all progress records
    const allProgress = await kv.getByPrefix("user:");
    const progressRecords = allProgress
      .filter(item => item.key.includes(":progress:"))
      .map(item => {
        const parts = item.key.split(":");
        return {
          userId: parts[1],
          trackId: parts[3],
          ...item.value
        };
      });
    
    return c.json({ success: true, progressRecords });
  } catch (error) {
    console.error("Get reports error:", error);
    return c.json({ error: "Failed to get reports" }, 500);
  }
});

// Send email notification (placeholder for now)
app.post("/make-server-7e07f5f2/notifications/email", async (c) => {
  try {
    const accessToken = c.req.header("Authorization")?.split(" ")[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const supabase = getSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    const { to, subject, body } = await c.req.json();
    
    // Log email notification (in production, integrate with SendGrid or similar)
    console.log("Email notification:", { to, subject, body });
    
    return c.json({ 
      success: true, 
      message: "Email notification logged (integration pending)" 
    });
  } catch (error) {
    console.error("Email notification error:", error);
    return c.json({ error: "Failed to send email" }, 500);
  }
});

Deno.serve(app.fetch);