import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ParentProfile {
  admission_id: string;
  parent_name: string;
  mobile_number: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('parent_profiles')
          .select('admission_id, parent_name, mobile_number')
          .eq('user_id', user.id)
          .single();

        if (error) {
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
          return;
        }

        setProfile(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, navigate, toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Profile not found</p>
          <Button onClick={handleLogout} variant="outline" className="mt-4">
            Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome, {profile.parent_name}!</CardTitle>
            <p className="text-lg text-muted-foreground">Admission ID: {profile.admission_id}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p className="text-base">{profile.mobile_number}</p>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base">{user?.email}</p>
              </div>
              
              <div className="border-t pt-4">
                <Button onClick={handleLogout} variant="outline">
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;