import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { DollarSign, CheckCircle2, Download, FileText, ShieldCheck } from 'lucide-react';
import { fetchFeeStructures } from '../../lib/dataService';
import { FeeStructure } from '../../types';

export const ParentFeePage: React.FC = () => {
  const [fees, setFees] = useState<FeeStructure[]>([]);

  useEffect(() => {
    fetchFeeStructures().then(setFees);
  }, []);

  return (
    <PortalLayout
      pageTitle="Fee Details & Account Status"
      pageSubtitle="Scholar: Fatima Bibi (Class 10 Matric Science) • Accounts Department"
    >
      <div className="space-y-6">

        {/* Current Account Status Card */}
        <Card className="p-6 sm:p-8 bg-gradient-to-r from-[#172230] via-[#131b26] to-[#1c182d] border border-[#23424d] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>All dues are fully settled (Account Cleared)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Outstanding Balance: <span className="text-emerald-400">Rs. 0</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Monthly tuition voucher has been paid on schedule. There are zero outstanding dues in the official ledger.
            </p>
          </div>

          <Button variant="primary" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
            Download Fee Receipt
          </Button>
        </Card>

        {/* Institutional Fee Schedule */}
        <Card className="p-6 bg-[#181827] border-[#2a2a3e] space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Academy Fee Schedule (PKR — Academic Year 2026-2027)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {fees.map((f) => (
              <div key={f.id} className="p-4 rounded-xl bg-white/[0.02] border border-[#2a2a3e] space-y-2">
                <Badge variant="cyan">{f.class_name || 'All Classes'}</Badge>
                <h4 className="text-sm font-bold text-white mt-1">{f.program}</h4>
                <div className="text-xl font-extrabold text-purple-300">Rs. {typeof f.amount === 'number' ? f.amount.toLocaleString() : f.amount} <span className="text-xs font-normal text-slate-400">/ {f.frequency || 'Monthly'}</span></div>
                <p className="text-xs text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </PortalLayout>
  );
};
