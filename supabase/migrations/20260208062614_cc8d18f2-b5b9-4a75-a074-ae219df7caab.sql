-- Add explicit deny policy for anonymous role on profiles table
-- This is a defense-in-depth measure that explicitly blocks the anon role
CREATE POLICY "Deny anonymous access to profiles"
ON public.profiles FOR SELECT
TO anon
USING (false);