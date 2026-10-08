import React from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Sparkles, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

interface PortalSectionPlaceholderProps {
  pageTitle: string;
  pageSubtitle: string;
  sectionName: string;
  phaseScheduled: string;
  role: 'student' | 'parent' | 'teacher' | 'admin';
  icon: React.ReactNode;
  highlights: string[];
}

export const PortalSectionPlaceholder: React.FC<PortalSectionPlaceholderProps> = ({
  pageTitle,
  pageSubtitle,
  sectionName,
  phaseScheduled,
  role,
  icon,
  highlights,
}) => {
  return (
    <PortalLayout pageTitle={pageTitle} pageSubtitle={pageSubtitle}>
      <div className="max-w-4xl space-y-6">
        
        {/* Banner */}
        <Card className="p-6 sm:p-8 bg-[#181827] border-[#2a2a3e] space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">{sectionName}</h2>
                  <Badge variant="purple">{phaseScheduled}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Protected route active and verified with Role-Based Access Control ({role.toUpperCase()}).
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#2a2a3e] space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Module Roadmap Specifications
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {highlights.map((h, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-xs text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <Link to={`/${role}/dashboard`}>
              <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Dashboard
              </Button>
            </Link>
            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock className="w-3.5 h-3.5" /> Full data ingestion scheduled in Phase 3–8
            </span>
          </div>
        </Card>

      </div>
    </PortalLayout>
  );
};
