-- Fix reviews table: Create a public view that hides user_id to prevent user tracking
-- while maintaining the ability for users to manage their own reviews

-- Create a public view for reviews that excludes user_id
CREATE VIEW public.reviews_public
WITH (security_invoker=on) AS
  SELECT 
    id,
    product_id,
    rating,
    title,
    content,
    is_verified_purchase,
    created_at
  FROM public.reviews;

-- Grant SELECT on the view to anon and authenticated roles
GRANT SELECT ON public.reviews_public TO anon;
GRANT SELECT ON public.reviews_public TO authenticated;

-- Update RLS policy: Remove public SELECT access from base reviews table
-- Keep the policy but make it owner-only for SELECT as well
DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;

-- Users can only view their own reviews directly (for editing/deleting)
CREATE POLICY "Users can view their own reviews"
ON public.reviews
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all reviews for moderation
CREATE POLICY "Admins can view all reviews"
ON public.reviews
FOR SELECT
USING (has_role(auth.uid(), 'admin'));