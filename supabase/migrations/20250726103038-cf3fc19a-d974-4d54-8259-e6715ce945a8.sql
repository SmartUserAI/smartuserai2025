-- Create ParentProfile table
CREATE TABLE public.parent_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  admission_id TEXT NOT NULL,
  parent_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.parent_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for parent profiles
CREATE POLICY "Users can view their own parent profile" 
ON public.parent_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own parent profile" 
ON public.parent_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own parent profile" 
ON public.parent_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_parent_profiles_user_id ON public.parent_profiles(user_id);