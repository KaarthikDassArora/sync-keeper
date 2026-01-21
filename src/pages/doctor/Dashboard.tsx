import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useClinicStore } from "@/store/clinic-store";
import { toast } from "sonner";
import { 
  LogOut, 
  Users, 
  IndianRupee, 
  Clock, 
  AlertTriangle,
  Phone,
  Play,
  CheckCircle,
  SkipForward,
  Stethoscope,
  Calendar,
  FileText
} from "lucide-react";
import { AppointmentStatus } from "@/types/clinic";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { 
    currentDoctor, 
    isAuthenticated, 
    logout, 
    getTodayAppointments,
    updateAppointmentStatus,
    getDailySummary,
    addVisit,
    doctors
  } = useClinicStore();
  
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [visitDialogOpen, setVisitDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>('');
  
  // Visit form state
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [prescription, setPrescription] = useState('');
  const [followupDate, setFollowupDate] = useState('');
  const [amount, setAmount] = useState('');
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/doctor/login');
    } else if (currentDoctor) {
      setSelectedDoctorId(currentDoctor.id);
    }
  }, [isAuthenticated, navigate, currentDoctor]);
  
  if (!isAuthenticated || !currentDoctor) {
    return null;
  }
  
  const appointments = getTodayAppointments(selectedDoctorId || undefined);
  const summary = getDailySummary();
  
  const handleStatusChange = (appointmentId: string, newStatus: AppointmentStatus) => {
    updateAppointmentStatus(appointmentId, newStatus);
    toast.success(`Status updated to ${newStatus}`);
  };
  
  const handleCompleteVisit = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setVisitDialogOpen(true);
  };
  
  const handleSaveVisit = () => {
    const appointment = appointments.find(a => a.id === selectedAppointmentId);
    if (!appointment) return;
    
    addVisit({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentId: appointment.id,
      visitDate: new Date().toISOString().split('T')[0],
      chiefComplaint: appointment.complaint,
      diagnosis,
      treatmentNotes: treatment,
      prescriptionText: prescription,
      followupDate: followupDate || undefined,
      amount: parseFloat(amount) || 0,
      paymentStatus: 'PENDING',
    });
    
    updateAppointmentStatus(selectedAppointmentId, 'DONE');
    
    // Reset form
    setDiagnosis('');
    setTreatment('');
    setPrescription('');
    setFollowupDate('');
    setAmount('');
    setVisitDialogOpen(false);
    
    toast.success('Visit completed and saved!');
  };
  
  const getStatusBadge = (status: AppointmentStatus) => {
    const config = {
      BOOKED: { label: 'Waiting', className: 'bg-muted text-muted-foreground' },
      CALLED: { label: 'Called', className: 'bg-warning text-warning-foreground' },
      IN_PROGRESS: { label: 'In Progress', className: 'bg-primary text-primary-foreground' },
      DONE: { label: 'Done', className: 'bg-success text-success-foreground' },
      SKIPPED: { label: 'Skipped', className: 'bg-destructive text-destructive-foreground' },
    };
    return <Badge className={config[status].className}>{config[status].label}</Badge>;
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
              <Stethoscope className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{currentDoctor.name}</h1>
              <p className="text-sm text-muted-foreground">Doctor {currentDoctor.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/doctor/followups">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Follow-ups
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{summary.totalPatients}</p>
                  <p className="text-sm text-muted-foreground">Patients Seen</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                  <IndianRupee className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{summary.totalCollection}</p>
                  <p className="text-sm text-muted-foreground">Collection</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{summary.pendingPayments}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{summary.pendingFollowups}</p>
                  <p className="text-sm text-muted-foreground">Follow-ups Due</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Queue Filter */}
        <div className="mb-4 flex items-center gap-4">
          <Label>View Queue:</Label>
          <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Doctors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Doctors</SelectItem>
              {doctors.map(doc => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.name} ({doc.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Queue Table */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Queue</CardTitle>
            <CardDescription>
              {appointments.length} patient(s) in queue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No patients in queue today
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((apt) => (
                    <TableRow key={apt.id}>
                      <TableCell>
                        <span className="font-mono font-bold text-lg">{apt.tokenNumber}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <Link 
                            to={`/doctor/patient/${apt.patientId}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {apt.patient?.name}
                          </Link>
                          <p className="text-sm text-muted-foreground">{apt.patient?.phone}</p>
                          {apt.patient && apt.patient.noShowCount > 0 && (
                            <Badge variant="destructive" className="mt-1 gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {apt.patient.noShowCount} no-shows
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {apt.complaint || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(apt.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {apt.status === 'BOOKED' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusChange(apt.id, 'CALLED')}
                              >
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleStatusChange(apt.id, 'SKIPPED')}
                              >
                                <SkipForward className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {apt.status === 'CALLED' && (
                            <Button 
                              size="sm"
                              onClick={() => handleStatusChange(apt.id, 'IN_PROGRESS')}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Start
                            </Button>
                          )}
                          {apt.status === 'IN_PROGRESS' && (
                            <Button 
                              size="sm"
                              className="bg-success hover:bg-success/90"
                              onClick={() => handleCompleteVisit(apt.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          {apt.status === 'DONE' && (
                            <Link to={`/doctor/patient/${apt.patientId}`}>
                              <Button size="sm" variant="ghost">
                                <FileText className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Complete Visit Dialog */}
      <Dialog open={visitDialogOpen} onOpenChange={setVisitDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Visit</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Diagnosis</Label>
              <Textarea 
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Enter diagnosis..."
              />
            </div>
            <div className="space-y-2">
              <Label>Treatment Notes</Label>
              <Textarea 
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Treatment performed..."
              />
            </div>
            <div className="space-y-2">
              <Label>Prescription</Label>
              <Textarea 
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Medicines prescribed..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Follow-up Date</Label>
                <Input 
                  type="date"
                  value={followupDate}
                  onChange={(e) => setFollowupDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setVisitDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveVisit}>
                Save & Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorDashboard;
