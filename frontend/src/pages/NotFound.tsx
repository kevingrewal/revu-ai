import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-brand-500 to-brand-400 bg-clip-text text-transparent">
          404
        </h1>
        <p className="mt-4 text-xl text-slate-600 dark:text-slate-400">
          Page not found
        </p>
        <p className="mt-2 text-slate-500 dark:text-slate-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  );
};
