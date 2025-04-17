
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Reservation from "./pages/Reservation";
import Quote from "./pages/Quote";
import About from "./pages/About";
import Services from "./pages/Services";
import Testimonials from "./pages/Testimonials";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import ClientArea from "./pages/ClientArea";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import OnlineReservationService from "./services/OnlineReservationService";
import ClientAreaService from "./services/ClientAreaService";

const queryClient = new QueryClient();

// Create app context for global state
export const AppContext = createContext<{
  onlineReservationEnabled: boolean;
  clientAreaEnabled: boolean;
  testimonialsEnabled: boolean;
}>({
  onlineReservationEnabled: false,
  clientAreaEnabled: false,
  testimonialsEnabled: true,
});

const App = () => {
  const [onlineReservationEnabled, setOnlineReservationEnabled] = useState(false);
  const [clientAreaEnabled, setClientAreaEnabled] = useState(false);
  const [testimonialsEnabled, setTestimonialsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load online reservation status
        const reservationStatus = await OnlineReservationService.getStatus();
        setOnlineReservationEnabled(reservationStatus);
        
        // Load client area status
        const clientAreaStatus = localStorage.getItem('clientAreaEnabled') === 'true';
        setClientAreaEnabled(clientAreaStatus);
        
        // Load testimonials status
        const testimonialsStatus = localStorage.getItem('testimonialsEnabled') !== 'false';
        setTestimonialsEnabled(testimonialsStatus);
      } catch (error) {
        console.error('Error loading app settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  if (isLoading) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AppContext.Provider value={{
        onlineReservationEnabled,
        clientAreaEnabled,
        testimonialsEnabled,
      }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reserver" element={<Reservation />} />
              <Route path="/devis" element={<Quote />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/temoignages" element={<Testimonials />} />
              <Route path="/galerie" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/espace-client" element={<ClientArea />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </AppContext.Provider>
    </QueryClientProvider>
  );
};

export default App;
