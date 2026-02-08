-- Add explicit policy to block anonymous access to addresses table
-- This ensures that even if other policies are misconfigured, unauthenticated users cannot access the table

CREATE POLICY "Block anonymous access to addresses"
ON public.addresses
FOR ALL
USING (auth.uid() IS NOT NULL);