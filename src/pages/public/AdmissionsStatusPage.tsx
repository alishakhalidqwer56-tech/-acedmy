import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Mail, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  FileText,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Admission, AdmissionStatus } from '../../types';
import { checkAdmissionStatusByEmail } from '../../lib/admissions';

export const AdmissionsStatusPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<Admission[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid applicant or guardian email address.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);
    setHasSearched(true);

    try {
      const records = await checkAdmissionStatusByEmail(email);
      setResults(records);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to query status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: AdmissionStatus) => {
    switch (status) {
      case 'approved':
        return <Badge variant="emerald" size="md">Approved / Admitted</Badge>;
      case 'rejected':
        return <Badge variant="pink" size="md">Not Accepted</Badge>;
      case 'pending':
      default:
        return <Badge variant="amber" size="md">Pending Review</Badge>;
    }
  };

  return (
    <div className="py-12 sm:py-16 space-y-12 min-h-[calc(100vh-16rem)]">
      
      {/* Hero */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto rounded-3xl bg-gradient-to-r from-[#171426] via-[#151522] to-[#201328] border border-[#2a2a3e] p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Application Tracker
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Check Admission <span className="text-gradient">Status</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Enter the email address provided in your application dossier to verify the latest evaluation decision.
            </p>
          </div>
        </div>
      </section>

      {/* Query Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 bg-[#161625] border-[#2a2a3e]">
          <form onSubmit={handleSearch} className="space-y-4">
            <Input
              label="Registered Email Address"
              type="email"
              required
              placeholder="e.g. guardian@example.com or applicant@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errorMessage || undefined}
              leftIcon={<Mail className="w-4 h-4 text-purple-400" />}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Link to="/admissions" className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Admissions Form
              </Link>
              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                rightIcon={<Search className="w-4 h-4" />}
              >
                Track Status
              </Button>
            </div>
          </form>
        </Card>
      </section>

      {/* Search Results Display */}
      {hasSearched && (
        <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
          {results.length === 0 ? (
            <Card className="p-8 bg-[#181827] border-[#2a2a3e] text-center space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Application Found for "{email}"</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                We could not find an admission record matching this email. Please ensure spelling matches the address entered on the submission form.
              </p>
              <Link to="/admissions" className="inline-block pt-2">
                <Button variant="outline" size="sm">
                  Submit New Application
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Found {results.length} Application Record{results.length > 1 ? 's' : ''}:
              </h3>

              {results.map((app) => (
                <Card
                  key={app.id}
                  className="p-6 bg-[#181827] border-[#2a2a3e] space-y-4 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                    <div>
                      <h4 className="text-base font-bold text-white">{app.student_name}</h4>
                      <p className="text-xs text-purple-300 mt-0.5">{app.program_applied || 'Academic Stream'}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div>
                      <span className="text-slate-500 block">Date Submitted</span>
                      <span className="text-slate-300 font-medium">
                        {app.created_at ? new Date(app.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Class Grade</span>
                      <span className="text-slate-300 font-medium">{app.class_grade_applying || 'Secondary'}</span>
                    </div>
                  </div>

                  {/* Guidance Message based on status */}
                  <div className="pt-2">
                    {app.status === 'approved' && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Congratulations! Your application is approved.
                        </div>
                        <p className="text-[11px] text-slate-300">
                          Please contact our Admissions Office at +1 (800) 555-4475 or reply to your confirmation email to complete enrollment.
                        </p>
                      </div>
                    )}

                    {app.status === 'pending' && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-amber-300">
                          <Clock className="w-4 h-4 text-amber-400" />
                          Application Under Review
                        </div>
                        <p className="text-[11px] text-slate-300">
                          The admissions council is actively evaluating your transcripts and credentials. Decisions are communicated within 5 business days.
                        </p>
                      </div>
                    )}

                    {app.status === 'rejected' && (
                      <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-300">
                          <XCircle className="w-4 h-4 text-rose-400" />
                          Application Not Approved
                        </div>
                        <p className="text-[11px] text-slate-300">
                          {app.admin_notes || 'Thank you for your interest. You are welcome to reapply during our upcoming spring cycle.'}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
};
