import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';

export function ThemeToggle() {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const currentTheme = resolvedTheme ?? theme ?? 'light';
  const isDark = currentTheme === 'dark';

  return (
    <div className="flex items-center gap-2 rounded-lg px-2 py-1">
      <Sun className={`h-4 w-4 ${isDark ? 'text-muted-foreground' : 'text-foreground'}`} />
      <Switch
        checked={isDark}
        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        aria-label="Toggle dark mode"
      />
      <Moon className={`h-4 w-4 ${isDark ? 'text-foreground' : 'text-muted-foreground'}`} />
    </div>
  );
}
