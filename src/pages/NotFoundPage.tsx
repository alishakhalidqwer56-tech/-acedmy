import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-20 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mx-auto">
          <AlertTriangle className="w-10 h-10 text-pink-400" />
        </div>
        
        <div>
          <span className="text-4xl sm:text-6xl font-black text-gradient block mb-2">404</span>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Page Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            The requested page does not exist or may have been relocated within the academy portal.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="outline" size="md">
              Browse Courses
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
