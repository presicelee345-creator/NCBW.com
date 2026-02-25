// Supabase client disabled - using localStorage instead
// This file is kept for compatibility but does not connect to Supabase

export const supabase = null;
export const API_BASE_URL = '';

export async function apiCall(endpoint: string, options: RequestInit = {}): Promise<any> {
  throw new Error('Supabase is disabled. Please use the localStorage API from /utils/api.ts instead.');
}
