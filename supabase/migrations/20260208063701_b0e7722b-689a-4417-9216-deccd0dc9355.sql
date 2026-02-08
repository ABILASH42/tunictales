-- Fix storage bucket security: Make custom-designs bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'custom-designs';

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view custom designs" ON storage.objects;

-- Create owner-only policies for custom-designs bucket
-- Users can only view their own designs (organized by user_id folder)
CREATE POLICY "Users can view their own designs in storage" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'custom-designs' 
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can upload to their own folder
DROP POLICY IF EXISTS "Users can upload custom designs" ON storage.objects;
CREATE POLICY "Users can upload their own designs" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'custom-designs'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own designs
CREATE POLICY "Users can update their own designs in storage" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'custom-designs'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own designs
CREATE POLICY "Users can delete their own designs in storage" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'custom-designs'
    AND auth.uid() IS NOT NULL
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Fix custom_designs table RLS: Remove NULL user_id access
DROP POLICY IF EXISTS "Users can manage their own designs" ON public.custom_designs;

-- Only allow access to designs owned by the authenticated user
CREATE POLICY "Users can manage their own designs" ON public.custom_designs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);