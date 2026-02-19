import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-dark-surface border-t border-slate-800 dark:border-dark-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Star className="h-6 w-6 text-brand-400" />
              <span className="text-lg font-bold text-white">Revu AI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              AI-powered product reviews and ratings to help you make smarter purchasing decisions.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Navigate
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-slate-400 hover:text-white text-sm transition-colors">
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              About
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Revu AI aggregates reviews from multiple sources and uses AI to analyze sentiment, giving you an unbiased product rating.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 dark:border-dark-border flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {currentYear} Revu AI. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Powered by AI sentiment analysis</p>
        </div>
      </div>
    </footer>
  );
};
