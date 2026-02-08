-- Fix profiles table RLS policies to remove confusion and strengthen security
-- Remove the confusing "Deny anonymous access to profiles" policy (false for anon)
DROP POLICY IF EXISTS "Deny anonymous access to profiles" ON public.profiles;

-- Drop and recreate the Block anonymous access policy as RESTRICTIVE
DROP POLICY IF EXISTS "Block anonymous access to profiles" ON public.profiles;

CREATE POLICY "Block anonymous access to profiles"
ON public.profiles
AS RESTRICTIVE
FOR ALL
USING (auth.uid() IS NOT NULL);

-- Fix addresses table RLS policies - make Block anonymous access RESTRICTIVE
DROP POLICY IF EXISTS "Block anonymous access to addresses" ON public.addresses;

CREATE POLICY "Block anonymous access to addresses"
ON public.addresses
AS RESTRICTIVE
FOR ALL
USING (auth.uid() IS NOT NULL);