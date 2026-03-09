import { Wind, Info, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle';

interface NavigationProps {
  isScrolled: boolean;
  onScrollToTop: () => void;
  onScrollToCalculator: () => void;
}

export function Navigation({ isScrolled, onScrollToTop, onScrollToCalculator }: NavigationProps) {
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-card/95 backdrop-blur-md shadow-md border-b border-border" 
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onScrollToTop}
          className="flex items-center gap-3 group"
        >
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
            isScrolled ? "bg-primary" : "bg-primary/90"
          )}>
            <Wind className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <h1 className={cn(
              "text-lg font-semibold transition-colors",
              isScrolled ? "text-foreground" : "text-foreground"
            )}>
              AQI Predictor
            </h1>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2">
          <button
            onClick={onScrollToTop}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isScrolled 
                ? "text-muted-foreground hover:text-foreground hover:bg-secondary" 
                : "text-foreground/80 hover:text-foreground hover:bg-white/10"
            )}
          >
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">About AQI</span>
          </button>
          
          <button
            onClick={onScrollToCalculator}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              isScrolled 
                ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                : "bg-white/10 text-foreground hover:bg-white/20 backdrop-blur-sm"
            )}
          >
            <Calculator className="w-4 h-4" />
            <span>Calculator</span>
          </button>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
