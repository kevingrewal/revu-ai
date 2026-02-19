import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const order = ['light', 'dark', 'system'] as const;
    const currentIndex = order.indexOf(theme);
    const nextIndex = (currentIndex + 1) % order.length;
    setTheme(order[nextIndex]);
  };

  const icon = {
    light: <Sun className="h-5 w-5" />,
    dark: <Moon className="h-5 w-5" />,
    system: <Monitor className="h-5 w-5" />,
  }[theme];

  const label = {
    light: 'Light mode (click for dark)',
    dark: 'Dark mode (click for system)',
    system: 'System theme (click for light)',
  }[theme];

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-surface-secondary transition-colors"
      aria-label={label}
    >
      {icon}
    </button>
  );
};
