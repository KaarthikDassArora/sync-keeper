import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Index from "./pages/Index";
import CheckIn from "./pages/public/CheckIn";
import BookAppointment from "./pages/public/BookAppointment";
import QueueStatus from "./pages/public/QueueStatus";

// Doctor Pages
import DoctorLogin from "./pages/doctor/Login";
import DoctorDashboard from "./pages/doctor/Dashboard";
import PatientDetail from "./pages/doctor/PatientDetail";
import FollowupList from "./pages/doctor/FollowupList";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<Index />} />
          
          {/* Public Routes */}
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/queue/:token" element={<QueueStatus />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patient/:id" element={<PatientDetail />} />
          <Route path="/doctor/followups" element={<FollowupList />} />
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
