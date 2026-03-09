import { useEffect, useRef, useState } from 'react';
import {
  Wind,
  Heart,
  Brain,
  ChevronDown,
  Sparkles,
  Activity,
  CloudSun,
  MapPin,
  Database,
  Cpu,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface LandingParallaxProps {
  onScrollToCalculator: () => void;
}

export function LandingParallax({ onScrollToCalculator }: LandingParallaxProps) {
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const setSectionRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el;
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-linear-to-b from-background via-background to-secondary/30">
      {/* Parallax Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating particles */}
        <div 
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
        <div 
          className="absolute top-40 right-[15%] w-96 h-96 rounded-full bg-accent/5 blur-3xl"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div 
          className="absolute bottom-40 left-[20%] w-80 h-80 rounded-full bg-primary/3 blur-3xl"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.1}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <div 
          className="max-w-4xl mx-auto"
          style={{ transform: `translateY(${scrollY * 0.4}px)`, opacity: Math.max(0, 1 - scrollY / 400) }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-4 h-4" />
            AI-Powered Air Quality Prediction
          </div>

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="text-foreground">Breathe </span>
            <span className="gradient-text">Smarter</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Predict air quality anywhere, anytime. Our AI model fills in missing sensor data 
            and provides accurate AQI forecasts with just a few inputs.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            onClick={onScrollToCalculator}
            className="group px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Wind className="w-5 h-5 mr-2" />
            Go to AQI Calculator
            <ChevronDown className="w-5 h-5 ml-2 animate-bounce" />
          </Button>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-2.5 rounded-full bg-muted-foreground/50 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative z-10 pb-20">
        {/* Section 1: AQI in 10 Seconds */}
        <div
          ref={setSectionRef(0)}
          data-index={0}
          className={cn(
            "max-w-6xl mx-auto px-6 py-20 transition-all duration-700",
            visibleSections.has(0) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          )}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" />
                Quick Overview
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                AQI in 10 Seconds
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                The <strong className="text-foreground">Air Quality Index (AQI)</strong> is a standardized 
                scale from 0 to 500 that tells you how clean or polluted your air is. It combines 
                measurements of multiple pollutants into a single, easy-to-understand number.
              </p>
              <div className="flex flex-wrap gap-3">
                {['PM2.5', 'PM10', 'NO2', 'O3', 'CO', 'SO2'].map((pollutant) => (
                  <span 
                    key={pollutant}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg bg-secondary text-secondary-foreground"
                  >
                    {pollutant}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Visual: AQI Scale */}
            <div className="relative">
              <div className="bg-card rounded-2xl p-6 shadow-xl border border-border">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
                  AQI Scale
                </h3>
                <div className="space-y-2">
                  {[
                    { range: '0-50', label: 'Good', color: 'bg-[hsl(142,72%,45%)]' },
                    { range: '51-100', label: 'Moderate', color: 'bg-[hsl(45,93%,50%)]' },
                    { range: '101-150', label: 'Unhealthy for Sensitive', color: 'bg-[hsl(30,95%,55%)]' },
                    { range: '151-200', label: 'Unhealthy', color: 'bg-[hsl(0,72%,55%)]' },
                    { range: '201-300', label: 'Very Unhealthy', color: 'bg-[hsl(280,60%,45%)]' },
                    { range: '301-500', label: 'Hazardous', color: 'bg-[hsl(340,70%,35%)]' },
                  ].map((item, i) => (
                    <div 
                      key={item.range} 
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                      style={{ 
                        transitionDelay: `${i * 50}ms`,
                        opacity: visibleSections.has(0) ? 1 : 0,
                        transform: visibleSections.has(0) ? 'translateX(0)' : 'translateX(-20px)',
                        transition: 'all 0.5s ease-out'
                      }}
                    >
                      <div className={cn("w-4 h-4 rounded-full", item.color)} />
                      <span className="text-sm font-medium text-foreground w-20">{item.range}</span>
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Why It Matters */}
        <div
          ref={setSectionRef(1)}
          data-index={1}
          className={cn(
            "max-w-6xl mx-auto px-6 py-20 transition-all duration-700",
            visibleSections.has(1) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          )}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold rounded-full bg-accent/10 text-accent uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5" />
              Health Impact
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Why AQI Matters
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: 'Health Protection',
                description: 'Poor air quality affects respiratory and cardiovascular health. Know when to limit outdoor exposure.',
                color: 'text-red-500',
                bgColor: 'bg-red-500/10',
              },
              {
                icon: CloudSun,
                title: 'Daily Planning',
                description: 'Plan outdoor activities, exercise, and commutes around air quality to minimize exposure.',
                color: 'text-amber-500',
                bgColor: 'bg-amber-500/10',
              },
              {
                icon: Activity,
                title: 'Sensitive Groups',
                description: 'Children, elderly, and those with conditions need extra protection when AQI rises.',
                color: 'text-purple-500',
                bgColor: 'bg-purple-500/10',
              },
            ].map((item, i) => (
              <div 
                key={item.title}
                className="bg-card rounded-2xl p-6 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{
                  transitionDelay: `${i * 100}ms`,
                  opacity: visibleSections.has(1) ? 1 : 0,
                  transform: visibleSections.has(1) ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'all 0.6s ease-out'
                }}
              >
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", item.bgColor)}>
                  <item.icon className={cn("w-6 h-6", item.color)} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Why AI Prediction */}
        <div
          ref={setSectionRef(2)}
          data-index={2}
          className={cn(
            "max-w-6xl mx-auto px-6 py-20 transition-all duration-700",
            visibleSections.has(2) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          )}
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Visual */}
            <div className="order-2 md:order-1">
              <div className="bg-linear-to-br from-primary/10 via-accent/5 to-primary/10 rounded-2xl p-8 border border-primary/20">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Limited Sensors', Icon: MapPin, desc: "Sensors don't cover everywhere" },
                    { label: 'Missing Data', Icon: Database, desc: 'Some pollutants not measured' },
                    { label: 'AI Fills Gaps', Icon: Cpu, desc: 'Predict from partial inputs' },
                    { label: 'Any Location', Icon: Globe, desc: "Works where sensors don't exist" },
                  ].map((item, i) => (
                    <div 
                      key={item.label}
                      className="bg-card/80 backdrop-blur rounded-xl p-4 text-center"
                      style={{
                        transitionDelay: `${i * 100}ms`,
                        opacity: visibleSections.has(2) ? 1 : 0,
                        transform: visibleSections.has(2) ? 'scale(1)' : 'scale(0.9)',
                        transition: 'all 0.5s ease-out'
                      }}
                    >
                      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <item.Icon className="h-5 w-5" />
                      </div>
                      <div className="text-xs font-semibold text-foreground mb-1">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 text-xs font-semibold rounded-full bg-primary/10 text-primary uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5" />
                AI-Powered
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Why AI Prediction?
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Traditional air quality monitoring relies on physical sensors that can't be 
                everywhere. Our AI model learns patterns from existing data to:
              </p>
              <ul className="space-y-3">
                {[
                  'Predict AQI for any location and time',
                  'Work with partial pollutant data',
                  'Fill gaps when sensors are missing',
                  'Provide forecasts for planning ahead',
                ].map((item, i) => (
                  <li 
                    key={i} 
                    className="flex items-center gap-3 text-foreground"
                    style={{
                      transitionDelay: `${i * 100 + 200}ms`,
                      opacity: visibleSections.has(2) ? 1 : 0,
                      transform: visibleSections.has(2) ? 'translateX(0)' : 'translateX(-20px)',
                      transition: 'all 0.5s ease-out'
                    }}
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div
          ref={setSectionRef(3)}
          data-index={3}
          className={cn(
            "max-w-4xl mx-auto px-6 py-20 text-center transition-all duration-700",
            visibleSections.has(3) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
          )}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Ready to Check Your Air Quality?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Click any location on the map, enter a timestamp and available pollutant data, 
            and get an instant AI-powered AQI prediction.
          </p>
          <Button 
            size="lg" 
            onClick={onScrollToCalculator}
            className="group px-10 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Wind className="w-5 h-5 mr-2" />
            Launch Calculator
            <ChevronDown className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}
