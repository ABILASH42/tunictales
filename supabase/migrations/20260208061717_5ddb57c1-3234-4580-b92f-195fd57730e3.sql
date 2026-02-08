-- Add explicit policy to block anonymous access to profiles table
-- This ensures that even if other policies are misconfigured, unauthenticated users cannot access the table

CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
FOR ALL
USING (auth.uid() IS NOT NULL);