-- Create a function to deduct stock when order items are inserted
CREATE OR REPLACE FUNCTION public.deduct_stock_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Deduct stock from the variant if variant_id is provided
  IF NEW.variant_id IS NOT NULL THEN
    UPDATE public.product_variants
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = NEW.variant_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically deduct stock when order items are created
CREATE TRIGGER deduct_stock_on_order_insert
AFTER INSERT ON public.order_items
FOR EACH ROW
EXECUTE FUNCTION public.deduct_stock_on_order();

-- Create a function to restore stock when orders are cancelled
CREATE OR REPLACE FUNCTION public.restore_stock_on_cancel()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only restore stock when status changes to 'cancelled'
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    UPDATE public.product_variants pv
    SET stock_quantity = pv.stock_quantity + oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = NEW.id
      AND oi.variant_id = pv.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to restore stock when order is cancelled
CREATE TRIGGER restore_stock_on_order_cancel
AFTER UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.restore_stock_on_cancel();