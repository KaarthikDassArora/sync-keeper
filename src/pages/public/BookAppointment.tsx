import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClinicStore } from "@/store/clinic-store";
import { toast } from "sonner";
import { ArrowLeft, Calendar, CheckCircle, Stethoscope } from "lucide-react";

const BookAppointment = () => {
  const navigate = useNavigate();
  const { doctors, getPatientByPhone, addPatient, createAppointment } = useClinicStore();
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [slot, setSlot] = useState('');
  const [complaint, setComplaint] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [bookedToken, setBookedToken] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    if (!doctorId) {
      toast.error('Please select a doctor');
      return;
    }
    
    if (!slot) {
      toast.error('Please select a time slot');
      return;
    }
    
    let patient = getPatientByPhone(phone);
    
    if (!patient) {
      if (!name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      patient = addPatient({
        name: name.trim(),
        phone,
        age: age ? parseInt(age) : undefined,
      });
    }
    
    const appointment = createAppointment(patient.id, doctorId, complaint, slot);
    setBookedToken(appointment.tokenNumber);
    setIsBooked(true);
    toast.success('Appointment booked successfully!');
  };
  
  if (isBooked) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <CardTitle className="text-2xl">Appointment Booked!</CardTitle>
            <CardDescription>Your token number is</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="py-6 px-4 bg-primary/10 rounded-lg">
              <span className="text-5xl font-bold text-primary">{bookedToken}</span>
            </div>
            <div className="text-left bg-muted p-4 rounded-lg space-y-2">
              <p><strong>Doctor:</strong> {doctors.find(d => d.id === doctorId)?.name}</p>
              <p><strong>Slot:</strong> {slot}</p>
              <p><strong>Date:</strong> Today</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please arrive 10 minutes before your slot. You can track your queue status anytime.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full" 
                onClick={() => navigate(`/queue/${bookedToken}`)}
              >
                Track Queue Status
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Book Appointment</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Schedule Your Visit</CardTitle>
            <CardDescription>
              Fill in your details to book an appointment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Not required if you're a returning patient
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Select Doctor *</Label>
                <Select value={doctorId} onValueChange={setDoctorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id}>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {doc.code}
                          </div>
                          {doc.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Preferred Slot *</Label>
                <Select value={slot} onValueChange={setSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Morning (9-12)">Morning (9 AM - 12 PM)</SelectItem>
                    <SelectItem value="Afternoon (12-3)">Afternoon (12 PM - 3 PM)</SelectItem>
                    <SelectItem value="Evening (4-7)">Evening (4 PM - 7 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="complaint">Reason for Visit</Label>
                <Textarea
                  id="complaint"
                  placeholder="Brief description of your problem"
                  value={complaint}
                  onChange={(e) => setComplaint(e.target.value)}
                  rows={3}
                />
              </div>
              
              <Button type="submit" className="w-full">
                Book Appointment
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default BookAppointment;
