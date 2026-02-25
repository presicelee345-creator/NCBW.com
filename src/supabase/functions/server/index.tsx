// Disabled - Application uses localStorage instead of Supabase
// This edge function is not used

export default async function handler() {
  return new Response(
    JSON.stringify({ message: 'This application uses localStorage and does not require Supabase edge functions.' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
