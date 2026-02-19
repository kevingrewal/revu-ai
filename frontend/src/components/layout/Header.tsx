import { useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Star, Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { SearchBar } from './SearchBar';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/categories', label: 'Categories' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-dark-surface/80 backdrop-blur-lg border-b border-surface-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-brand-500" />
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Revu AI
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-500 rounded-full" />
                )}
              </Link>
            ))}
            <div className="ml-4">
              <SearchBar key={searchQuery} initialQuery={searchQuery} />
            </div>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-dark-surface-secondary transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-surface-border dark:border-dark-border pt-4 space-y-1">
            <div className="px-2 mb-3">
              <SearchBar key={searchQuery} initialQuery={searchQuery} />
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-surface-secondary'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
