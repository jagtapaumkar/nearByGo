import React, { useState } from 'react';
import { AuthContext, useAuthProvider } from './hooks/useAuth';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HeroCarousel from './components/HeroCarousel';
import CategoryGrid from './components/CategoryGrid';
import ProductShowcase from './components/ProductShowcase';
import TestimonialCarousel from './components/TestimonialCarousel';
import Footer from './components/Footer';

function App() {
  const auth = useAuthProvider();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <AuthContext.Provider value={auth}>
      <div className="min-h-screen bg-white">
        <Header 
          onMobileMenuToggle={handleMobileMenuToggle}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        
        <Navigation isMobileOpen={isMobileMenuOpen} />
        
        <main className="mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <HeroCarousel />
          </div>
          
          <CategoryGrid />
          <ProductShowcase />
          <TestimonialCarousel />
        </main>
        
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;