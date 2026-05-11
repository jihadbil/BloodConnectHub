import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StaffLogin from "./pages/StaffLogin";
import StaffRegister from "./pages/StaffRegister";
import BloodRequests from "./pages/BloodRequests";
import DonorDashboard from "./pages/DonorDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StaffManagement from "./pages/StaffManagement";
import DonorsManagement from "./pages/DonorsManagement";
import PatientsManagement from "./pages/PatientsManagement";
import DonationsManagement from "./pages/DonationsManagement";
import InventoryManagement from "./pages/InventoryManagement";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ReportsDashboard from "./pages/ReportsDashboard";
import ReportsDonors from "./pages/ReportsDonors";
import ReportsDonations from "./pages/ReportsDonations";
import ReportsInventory from "./pages/ReportsInventory";
import ReportsRequests from "./pages/ReportsRequests";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/staff/login" element={<StaffLogin />} />
              <Route path="/staff/register" element={<StaffRegister />} />
              <Route path="/blood-requests" element={<BloodRequests />} />
              <Route
                path="/donor/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["donor", "admin"]}>
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <StaffDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/staff-management"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <StaffManagement />
                  </ProtectedRoute>
                }
              />
              {/* صفحات إدارة الموظفين */}
              <Route
                path="/staff/donors"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <DonorsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/patients"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <PatientsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/donations"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <DonationsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/inventory"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <InventoryManagement />
                  </ProtectedRoute>
                }
              />
              {/* صفحة الملف الشخصي */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["donor", "staff", "admin"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              {/* صفحات التقارير */}
              <Route
                path="/staff/reports"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <ReportsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/reports/donors"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <ReportsDonors />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/reports/donations"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <ReportsDonations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/reports/inventory"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <ReportsInventory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/staff/reports/requests"
                element={
                  <ProtectedRoute allowedRoles={["staff", "admin"]}>
                    <ReportsRequests />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
