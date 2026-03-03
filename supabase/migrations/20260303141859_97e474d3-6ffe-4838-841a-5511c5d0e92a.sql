
-- Fix products: drop restrictive SELECT and recreate as permissive
DROP POLICY "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Fix categories
DROP POLICY "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- Fix product_variants
DROP POLICY "Anyone can view variants" ON public.product_variants;
CREATE POLICY "Anyone can view variants" ON public.product_variants FOR SELECT USING (true);

-- Fix product_recommendations
DROP POLICY "Anyone can view recommendations" ON public.product_recommendations;
CREATE POLICY "Anyone can view recommendations" ON public.product_recommendations FOR SELECT USING (true);

-- Fix homepage_sections
DROP POLICY "Anyone can view visible sections" ON public.homepage_sections;
CREATE POLICY "Anyone can view visible sections" ON public.homepage_sections FOR SELECT USING (is_visible = true);

-- Fix offers
DROP POLICY "Anyone can view active offers" ON public.offers;
CREATE POLICY "Anyone can view active offers" ON public.offers FOR SELECT USING (is_active = true);

-- Fix reviews_public view (it's a view, no RLS needed)

-- Also fix the admin ALL policies to be permissive for proper admin access
DROP POLICY "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Admins can manage variants" ON public.product_variants;
CREATE POLICY "Admins can manage variants" ON public.product_variants FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Admins can manage recommendations" ON public.product_recommendations;
CREATE POLICY "Admins can manage recommendations" ON public.product_recommendations FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Admins can manage sections" ON public.homepage_sections;
CREATE POLICY "Admins can manage sections" ON public.homepage_sections FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY "Admins can manage offers" ON public.offers;
CREATE POLICY "Admins can manage offers" ON public.offers FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));
