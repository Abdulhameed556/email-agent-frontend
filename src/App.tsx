import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import DashboardLayout from "./components/DashboardLayout";
import Inbox from "./pages/Inbox";
import Templates from "./pages/Templates";
import Activity from "./pages/Activity";
import KnowledgeBase from "./pages/KnowledgeBase";
import DashboardSettings from "./pages/DashboardSettings";
import NotFound from "./pages/NotFound";

import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId="761248115548-krm3se15kf4hvj0gutkej64qjfsb2943.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Inbox />} />
              <Route path="templates" element={<Templates />} />
              <Route path="activity" element={<Activity />} />
              <Route path="knowledge-base" element={<KnowledgeBase />} />
              <Route path="settings" element={<DashboardSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
