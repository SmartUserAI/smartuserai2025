-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create parent profile on user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();