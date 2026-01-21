import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Stethoscope, 
  Users, 
  Calendar, 
  ClipboardList, 
  Clock,
  ArrowRight
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">DentalCare</h1>
              <p className="text-xs text-muted-foreground">Queue Management System</p>
            </div>
          </div>
          <Link to="/doctor/login">
            <Button variant="outline">Doctor Login</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Welcome to DentalCare Clinic
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Skip the wait. Check-in online, book appointments, and track your queue status in real-time.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/checkin">
              <Button size="lg" className="gap-2">
                <ClipboardList className="h-5 w-5" />
                Walk-in Check-in
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/book">
              <Button size="lg" variant="outline" className="gap-2">
                <Calendar className="h-5 w-5" />
                Book Appointment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <ClipboardList className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Check-in</CardTitle>
                <CardDescription>
                  Enter your details and get a token number instantly
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Track Queue</CardTitle>
                <CardDescription>
                  See your position in real-time from anywhere
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Get Called</CardTitle>
                <CardDescription>
                  Receive notification when it's your turn
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Our Doctors</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    A
                  </div>
                  <div>
                    <CardTitle>Dr. Rahul Sharma</CardTitle>
                    <CardDescription>General Dentistry</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  10+ years experience in dental care, specializing in root canals and cosmetic dentistry.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-2xl font-bold text-accent-foreground">
                    B
                  </div>
                  <div>
                    <CardTitle>Dr. Priya Sharma</CardTitle>
                    <CardDescription>Pediatric Dentistry</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Specialist in children's dental care with a gentle and caring approach.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4 bg-card">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 DentalCare Clinic. All rights reserved.</p>
          <p className="text-sm mt-2">
            Open: Mon-Sat, 9 AM - 7 PM | Contact: +91 98765 43210
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
