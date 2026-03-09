import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackToTopProps {
  visible: boolean;
  onClick: () => void;
}

export function BackToTop({ visible, onClick }: BackToTopProps) {
  return (
    <Button
      size="icon"
      variant="secondary"
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full shadow-lg transition-all duration-300",
        "hover:shadow-xl hover:scale-110",
        visible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  );
}
