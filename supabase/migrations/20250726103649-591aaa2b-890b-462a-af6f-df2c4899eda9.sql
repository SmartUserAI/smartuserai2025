-- Fix function security by setting search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = ''
AS $$
BEGIN
  -- Only create profile if user metadata contains the required fields
  IF NEW.raw_user_meta_data ? 'admission_id' THEN
    INSERT INTO public.parent_profiles (
      user_id,
      admission_id,
      parent_name,
      mobile_number
    ) VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'admission_id',
      NEW.raw_user_meta_data->>'parent_name',
      NEW.raw_user_meta_data->>'mobile_number'
    );
  END IF;
  
  RETURN NEW;
END;
$$;