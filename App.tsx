import { useState, useEffect } from 'react';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AchievementsSection } from './components/AchievementsSection';
import { ServicesSection } from './components/ServicesSection';
import { PortfolioSection } from './components/PortfolioSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { WorkflowSection } from './components/WorkflowSection';
import { BookingFormSection } from './components/BookingFormSection';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { trackPageView, isAdminAuthenticated, safeSessionGet } from './services/adminService';

export function App() {
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return !safeSessionGet('ecomwithshah_intro_seen');
  });

  const [selectedService, setSelectedService] = useState<string>('UGC Ads');
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);

  // Admin panel states
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Track page views on initial load
  useEffect(() => {
    trackPageView();
  }, []);

  // Always start at the top when switching between the site and the admin panel
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showAdminDashboard]);

  // Custom ambient red cursor follower
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = !!target.closest('button, a, input, select, textarea, [role="button"]');
        setIsPointer(isClickable);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectService = (serviceName: string) => {
    setSelectedService(serviceName);
    scrollToSection('booking');
  };

  const handleOpenAdmin = () => {
    if (isAdminAuthenticated()) {
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
  };

  // If viewing the Admin Panel
  if (showAdminDashboard) {
    return (
      <AdminDashboard onBackToSite={() => setShowAdminDashboard(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white selection:bg-[#E50914] selection:text-white relative">
      
      {/* 1. CINEMATIC WEBSITE INTRO */}
      {showIntro && (
        <CinematicIntro onComplete={() => setShowIntro(false)} />
      )}

      {/* Ambient Red Lighting Glow following cursor on desktop */}
      <div 
        className="fixed pointer-events-none z-30 transition-transform duration-75 ease-out hidden md:block"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
        }}
      >
        <div className="w-8 h-8 rounded-full border border-red-500/30 bg-[#E50914]/10 backdrop-blur-[1px]" />
      </div>

      {/* 2. STICKY GLASSMORPHISM NAVIGATION WITH ADMIN TRIGGER */}
      <Navbar 
        onBookCallClick={() => scrollToSection('booking')} 
        onOpenAdmin={handleOpenAdmin}
      />

      {/* MAIN CONTENT RUNWAY */}
      <main className="relative">
        {/* HERO SECTION WITH SHAHZAIB'S ANIMATED CHARACTER */}
        <HeroSection 
          onExploreWork={() => scrollToSection('portfolio')} 
          onBookCall={() => scrollToSection('booking')} 
        />

        {/* 3. ANIMATED ACHIEVEMENT COUNTERS */}
        <AchievementsSection />

        {/* 4. WHAT WE DO (SERVICES) */}
        <ServicesSection onSelectService={handleSelectService} />

        {/* 5. MY WORK / VIDEO PORTFOLIO */}
        <PortfolioSection />

        {/* 6. CLIENT TESTIMONIALS */}
        <TestimonialsSection />

        {/* 7. HOW WE WORK (WORKFLOW) */}
        <WorkflowSection />

        {/* 8. CONTACT FORM */}
        <BookingFormSection initialService={selectedService} />
      </main>

      {/* 9. PREMIUM FOOTER */}
      <Footer 
        onNavigate={scrollToSection} 
        onOpenAdmin={handleOpenAdmin}
      />

      {/* ADMIN AUTHENTICATION MODAL */}
      <AdminLoginModal
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
      />

    </div>
  );
}

export default App;
