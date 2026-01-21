import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { 
  ArrowLeft, 
  Calendar, 
  MessageCircle,
  AlertTriangle,
  Clock
} from "lucide-react";
import { toast } from "sonner";

const FollowupList = () => {
  const navigate = useNavigate();
  const { isAuthenticated, getPendingFollowups, patients } = useClinicStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/doctor/login');
    }
  }, [isAuthenticated, navigate]);
  
  const pendingFollowups = getPendingFollowups();
  
  const getPatient = (patientId: string) => {
    return patients.find(p => p.id === patientId);
  };
  
  const handleSendReminder = (patientId: string) => {
    const patient = getPatient(patientId);
    if (patient) {
      // Mock WhatsApp integration - would open WhatsApp in real implementation
      const message = encodeURIComponent(
        `Hi ${patient.name}, this is a reminder for your dental follow-up appointment. Please visit us at your earliest convenience.`
      );
      window.open(`https://wa.me/91${patient.phone}?text=${message}`, '_blank');
      toast.success('Opening WhatsApp...');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/doctor/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Pending Follow-ups</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Overdue Follow-ups
            </CardTitle>
            <CardDescription>
              Patients with past follow-up dates who haven't returned
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingFollowups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending follow-ups</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Last Visit</TableHead>
                    <TableHead>Follow-up Date</TableHead>
                    <TableHead>Days Overdue</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingFollowups.map((visit) => {
                    const patient = getPatient(visit.patientId);
                    const followupDate = new Date(visit.followupDate!);
                    const today = new Date();
                    const daysOverdue = Math.floor(
                      (today.getTime() - followupDate.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    
                    return (
                      <TableRow key={visit.id}>
                        <TableCell>
                          <Link 
                            to={`/doctor/patient/${visit.patientId}`}
                            className="font-medium hover:text-primary hover:underline"
                          >
                            {patient?.name || 'Unknown'}
                          </Link>
                        </TableCell>
                        <TableCell>{patient?.phone || '-'}</TableCell>
                        <TableCell>{visit.visitDate}</TableCell>
                        <TableCell>{visit.followupDate}</TableCell>
                        <TableCell>
                          <Badge variant={daysOverdue > 7 ? 'destructive' : 'outline'}>
                            {daysOverdue} days
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleSendReminder(visit.patientId)}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Send Reminder
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FollowupList;
