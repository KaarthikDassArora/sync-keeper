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
import { ArrowLeft, CheckCircle, Stethoscope, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CheckIn = () => {
  const navigate = useNavigate();
  const { doctors, getPatientByPhone, addPatient, createAppointment } = useClinicStore();
  
  const [step, setStep] = useState<'phone' | 'details' | 'success'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [createdToken, setCreatedToken] = useState('');
  const [existingPatient, setExistingPatient] = useState<ReturnType<typeof getPatientByPhone>>(undefined);
  
  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    const patient = getPatientByPhone(phone);
    if (patient) {
      setExistingPatient(patient);
      setName(patient.name);
      setAge(patient.age?.toString() || '');
    }
    setStep('details');
  };
  
  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!doctorId) {
      toast.error('Please select a doctor');
      return;
    }
    
    let patientId = existingPatient?.id;
    
    // Create new patient if not existing
    if (!patientId) {
      if (!name.trim()) {
        toast.error('Please enter your name');
        return;
      }
      const newPatient = addPatient({
        name: name.trim(),
        phone,
        age: age ? parseInt(age) : undefined,
      });
      patientId = newPatient.id;
    }
    
    // Create appointment
    const appointment = createAppointment(patientId, doctorId, complaint, 'Walk-in');
    setCreatedToken(appointment.tokenNumber);
    setStep('success');
    toast.success('Check-in successful!');
  };
  
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <CardTitle className="text-2xl">Check-in Successful!</CardTitle>
            <CardDescription>Your token number is</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="py-6 px-4 bg-primary/10 rounded-lg">
              <span className="text-5xl font-bold text-primary">{createdToken}</span>
            </div>
            <p className="text-muted-foreground">
              Please wait for your turn. You can track your queue status anytime.
            </p>
            <div className="flex flex-col gap-3">
              <Button 
                className="w-full" 
                onClick={() => navigate(`/queue/${createdToken}`)}
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
            <Stethoscope className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Walk-in Check-in</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>
              {step === 'phone' ? 'Enter Your Phone Number' : 'Complete Check-in'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'We\'ll use this to find your records' 
                : 'Verify your details and select a doctor'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="text-lg"
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleCheckIn} className="space-y-4">
                {existingPatient && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">Welcome back!</p>
                    <p className="font-medium">{existingPatient.name}</p>
                    {existingPatient.noShowCount > 0 && (
                      <Badge variant="destructive" className="mt-2 gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {existingPatient.noShowCount} no-show(s)
                      </Badge>
                    )}
                  </div>
                )}
                
                {!existingPatient && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
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
                  </>
                )}
                
                <div className="space-y-2">
                  <Label>Select Doctor *</Label>
                  <Select value={doctorId} onValueChange={setDoctorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.name} (Dr. {doc.code})
                        </SelectItem>
                      ))}
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
                
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep('phone')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button type="submit" className="flex-1">
                    Get Token
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CheckIn;
