import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClinicStore } from "@/store/clinic-store";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  PlayCircle,
  PhoneCall,
  Stethoscope,
  RefreshCw
} from "lucide-react";
import { AppointmentStatus } from "@/types/clinic";

const statusConfig: Record<AppointmentStatus, { 
  label: string; 
  color: string; 
  icon: React.ReactNode;
  description: string;
}> = {
  BOOKED: { 
    label: 'Waiting', 
    color: 'bg-muted text-muted-foreground',
    icon: <Clock className="h-8 w-8" />,
    description: 'You are in the queue. Please wait for your turn.'
  },
  CALLED: { 
    label: 'Your Turn!', 
    color: 'bg-warning text-warning-foreground',
    icon: <PhoneCall className="h-8 w-8 animate-pulse" />,
    description: 'Please proceed to the doctor\'s room immediately.'
  },
  IN_PROGRESS: { 
    label: 'In Progress', 
    color: 'bg-primary text-primary-foreground',
    icon: <PlayCircle className="h-8 w-8" />,
    description: 'Your consultation is in progress.'
  },
  DONE: { 
    label: 'Completed', 
    color: 'bg-success text-success-foreground',
    icon: <CheckCircle className="h-8 w-8" />,
    description: 'Your visit is complete. Thank you!'
  },
  SKIPPED: { 
    label: 'Skipped', 
    color: 'bg-destructive text-destructive-foreground',
    icon: <XCircle className="h-8 w-8" />,
    description: 'You missed your turn. Please check-in again.'
  },
};

const QueueStatus = () => {
  const { token } = useParams<{ token: string }>();
  const { getAppointmentByToken, getTodayAppointments } = useClinicStore();
  
  const appointment = getAppointmentByToken(token || '');
  
  if (!appointment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <XCircle className="h-10 w-10 text-destructive" />
            </div>
            <CardTitle>Token Not Found</CardTitle>
            <CardDescription>
              The token "{token}" was not found in today's queue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/">
              <Button className="w-full">Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const status = statusConfig[appointment.status];
  const doctorQueue = getTodayAppointments(appointment.doctorId);
  
  // Calculate position in queue
  const waitingBefore = doctorQueue.filter(
    a => a.status === 'BOOKED' && a.tokenNumber < appointment.tokenNumber
  ).length;
  
  const currentlyServing = doctorQueue.find(
    a => a.status === 'IN_PROGRESS' || a.status === 'CALLED'
  );
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Queue Status</h1>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Token Card */}
          <Card>
            <CardHeader className="text-center pb-2">
              <CardDescription>Your Token</CardDescription>
              <div className="py-4">
                <span className="text-6xl font-bold text-primary">{appointment.tokenNumber}</span>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <Badge className={`${status.color} text-lg px-4 py-2`}>
                {status.icon}
                <span className="ml-2">{status.label}</span>
              </Badge>
              <p className="mt-4 text-muted-foreground">{status.description}</p>
            </CardContent>
          </Card>

          {/* Queue Info */}
          {(appointment.status === 'BOOKED' || appointment.status === 'CALLED') && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Queue Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Doctor</span>
                  <span className="font-medium">{appointment.doctor?.name}</span>
                </div>
                {currentlyServing && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Currently Serving</span>
                    <Badge variant="outline">{currentlyServing.tokenNumber}</Badge>
                  </div>
                )}
                {appointment.status === 'BOOKED' && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Patients Before You</span>
                    <span className="text-2xl font-bold text-primary">{waitingBefore}</span>
                  </div>
                )}
                {appointment.complaint && (
                  <div className="pt-2 border-t">
                    <span className="text-sm text-muted-foreground">Reason:</span>
                    <p className="mt-1">{appointment.complaint}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Today's Queue Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Today's Queue - Dr. {appointment.doctor?.code}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {doctorQueue.slice(0, 10).map((apt) => (
                  <div 
                    key={apt.id} 
                    className={`flex items-center justify-between p-2 rounded ${
                      apt.id === appointment.id ? 'bg-primary/10 border border-primary' : 'bg-muted'
                    }`}
                  >
                    <span className="font-mono font-medium">{apt.tokenNumber}</span>
                    <Badge variant="outline" className={
                      apt.status === 'DONE' ? 'bg-success/10 text-success' :
                      apt.status === 'IN_PROGRESS' ? 'bg-primary/10 text-primary' :
                      apt.status === 'CALLED' ? 'bg-warning/10 text-warning' :
                      apt.status === 'SKIPPED' ? 'bg-destructive/10 text-destructive' :
                      ''
                    }>
                      {apt.status === 'IN_PROGRESS' ? 'In Progress' : 
                       apt.status === 'BOOKED' ? 'Waiting' : 
                       apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default QueueStatus;
