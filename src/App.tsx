import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import UserDashboard from './pages/UserDashboard';
import CaregiverDashboard from './pages/CaregiverDashboard';
import LearningGames from './pages/LearningGames';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/caregiver-dashboard" element={<CaregiverDashboard />} />
          <Route path="/learning-games" element={<LearningGames />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;