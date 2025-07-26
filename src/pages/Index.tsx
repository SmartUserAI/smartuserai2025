import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Parent Portal</CardTitle>
          <CardDescription className="text-center">
            Access your parent dashboard and manage your child's admission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link to="/login" className="block">
            <Button className="w-full" size="lg">
              Login to Dashboard
            </Button>
          </Link>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New parent?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
