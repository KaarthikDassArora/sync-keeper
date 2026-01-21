import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useClinicStore } from "@/store/clinic-store";
import { toast } from "sonner";
import { Stethoscope, ArrowLeft } from "lucide-react";

const DoctorLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useClinicStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/doctor/dashboard');
    return null;
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    const success = login(email, password);
    if (success) {
      toast.success('Welcome back!');
      navigate('/doctor/dashboard');
    } else {
      toast.error('Invalid credentials. Try rahul@clinic.com or priya@clinic.com');
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">Doctor Login</CardTitle>
          <CardDescription>
            Sign in to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@clinic.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
            <p className="text-xs font-mono">rahul@clinic.com (Dr. A)</p>
            <p className="text-xs font-mono">priya@clinic.com (Dr. B)</p>
            <p className="text-xs text-muted-foreground mt-1">Any password works</p>
          </div>
          
          <div className="mt-4 text-center">
            <Link to="/" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorLogin;
