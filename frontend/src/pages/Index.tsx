import { useState, useCallback, useRef, useEffect } from 'react';
import { LandingParallax } from '@/components/LandingParallax/LandingParallax';
import { Navigation } from '@/components/Navigation/Navigation';
import { Calculator } from '@/components/Calculator/Calculator';
import { BackToTop } from '@/components/BackToTop/BackToTop';

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
      setShowBackToTop(scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCalculator = useCallback(() => {
    calculatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const scrollToTop = useCallback(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Anchor for top */}
      <div ref={topRef} />

      {/* Navigation */}
      <Navigation 
        isScrolled={isScrolled}
        onScrollToTop={scrollToTop}
        onScrollToCalculator={scrollToCalculator}
      />

      {/* Landing Section */}
      <LandingParallax onScrollToCalculator={scrollToCalculator} />

      {/* Calculator Section */}
      <div ref={calculatorRef} className="scroll-mt-20">
        <div className="bg-secondary/30 py-8 text-center border-y border-border">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">AQI Calculator</h2>
          <p className="text-muted-foreground mt-2">Click the map to select a location and predict air quality</p>
        </div>
        <Calculator />
      </div>

      {/* Back to Top Button */}
      <BackToTop visible={showBackToTop} onClick={scrollToTop} />
    </div>
  );
};

export default Index;
