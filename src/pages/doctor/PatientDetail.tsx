import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useClinicStore } from "@/store/clinic-store";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Calendar, 
  AlertTriangle,
  IndianRupee,
  CheckCircle,
  Clock,
  FileText
} from "lucide-react";
import { useEffect } from "react";

const PatientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getPatient, 
    getPatientVisits, 
    isAuthenticated,
    updateVisitPayment 
  } = useClinicStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/doctor/login');
    }
  }, [isAuthenticated, navigate]);
  
  const patient = getPatient(id || '');
  const visits = getPatientVisits(id || '');
  
  if (!patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Patient Not Found</CardTitle>
            <CardDescription>
              The patient with ID "{id}" was not found.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/doctor/dashboard">
              <Button className="w-full">Back to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const totalSpent = visits.reduce((sum, v) => sum + v.amount, 0);
  const pendingAmount = visits
    .filter(v => v.paymentStatus !== 'PAID')
    .reduce((sum, v) => sum + v.amount, 0);
  
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
          <h1 className="text-xl font-bold">Patient Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Patient Info Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle>{patient.name}</CardTitle>
                  {patient.noShowCount > 0 && (
                    <Badge variant="destructive" className="mt-1 gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {patient.noShowCount} no-shows
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{patient.phone}</span>
              </div>
              {patient.age && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{patient.age} years old</span>
                </div>
              )}
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Visits</span>
                  <span className="font-medium">{visits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-medium">₹{totalSpent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pending</span>
                  <span className="font-medium text-warning">₹{pendingAmount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit History */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Visit History
              </CardTitle>
              <CardDescription>
                All past visits and treatment records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {visits.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No visit history found
                </div>
              ) : (
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <Card key={visit.id} className="border">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">{visit.visitDate}</p>
                            <p className="text-sm text-muted-foreground">
                              {visit.chiefComplaint}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge 
                              className={
                                visit.paymentStatus === 'PAID' 
                                  ? 'bg-success text-success-foreground' 
                                  : 'bg-warning text-warning-foreground'
                              }
                            >
                              {visit.paymentStatus === 'PAID' ? (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              ) : (
                                <Clock className="h-3 w-3 mr-1" />
                              )}
                              ₹{visit.amount} - {visit.paymentStatus}
                            </Badge>
                            {visit.paymentStatus !== 'PAID' && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="mt-2"
                                onClick={() => updateVisitPayment(visit.id, 'PAID')}
                              >
                                <IndianRupee className="h-4 w-4 mr-1" />
                                Mark Paid
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {visit.diagnosis && (
                          <div className="mb-2">
                            <p className="text-sm font-medium">Diagnosis:</p>
                            <p className="text-sm text-muted-foreground">{visit.diagnosis}</p>
                          </div>
                        )}
                        
                        {visit.treatmentNotes && (
                          <div className="mb-2">
                            <p className="text-sm font-medium">Treatment:</p>
                            <p className="text-sm text-muted-foreground">{visit.treatmentNotes}</p>
                          </div>
                        )}
                        
                        {visit.prescriptionText && (
                          <div className="mb-2">
                            <p className="text-sm font-medium">Prescription:</p>
                            <p className="text-sm text-muted-foreground">{visit.prescriptionText}</p>
                          </div>
                        )}
                        
                        {visit.followupDate && (
                          <div className="mt-3 pt-3 border-t">
                            <Badge variant="outline">
                              <Calendar className="h-3 w-3 mr-1" />
                              Follow-up: {visit.followupDate}
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default PatientDetail;
