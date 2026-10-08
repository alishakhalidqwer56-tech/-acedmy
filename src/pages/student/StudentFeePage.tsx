import React, { useState, useEffect } from 'react';
import { PortalLayout } from '../../components/layout/PortalLayout';
import { Card } from '../../components/ui/Card';
import { Table, Column } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { useSite } from '../../context/SiteContext';
import { fetchFeeStructures } from '../../lib/dataService';
import { FeeStructure } from '../../types';
import { DollarSign, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const StudentFeePage: React.FC = () => {
  const { settings } = useSite();
  const [fees, setFees] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchFeeStructures();
        setFees(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const isAdmissionOpen = settings.admission_open === 'true' || settings.admissions_open === 'true';
  const admissionLastDate = settings.admission_last_date || '31/12/2026';

  const columns: Column<FeeStructure>[] = [
    {
      key: 'program',
      header: 'Academic Program',
      sortable: true,
      render: (f) => (
        <div>
          <span className="font-semibold text-white block">{f.program}</span>
          {f.description && <span className="text-[11px] text-slate-400">{f.description}</span>}
        </div>
      )
    },
    {
      key: 'class_name',
      header: 'Class / Wing',
      sortable: true,
      render: (f) => (
        <Badge variant="purple" size="sm">{f.class_name || 'All Sections'}</Badge>
      )
    },
    {
      key: 'amount',
      header: 'Tuition Fee (PKR)',
      sortable: true,
      render: (f) => (
        <span className="font-bold text-emerald-400 text-sm">
          Rs. {Number(f.amount).toLocaleString('en-PK')}
        </span>
      )
    },
    {
      key: 'frequency',
      header: 'Billing Frequency',
      render: (f) => (
        <Badge variant="slate" size="sm">{f.frequency || 'Monthly'}</Badge>
      )
    }
  ];

  return (
    <PortalLayout
      pageTitle="Institutional Fee Structure"
      pageSubtitle="Official schedule of tuition, laboratory consumables, and examination dues in Pakistani Rupees (PKR)"
    >
      <div className="space-y-6 max-w-6xl">
        {/* Admission Open Status Card */}
        <Card className={`p-5 border ${
          isAdmissionOpen 
            ? 'bg-purple-950/20 border-purple-500/30' 
            : 'bg-slate-900/40 border-slate-700/40'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                isAdmissionOpen ? 'bg-purple-500/20 text-purple-300' : 'bg-slate-700/40 text-slate-400'
              }`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">Campus Admissions Status</h4>
                  {isAdmissionOpen ? (
                    <Badge variant="emerald" size="sm">Admissions Open</Badge>
                  ) : (
                    <Badge variant="slate" size="sm">Closed for Current Cycle</Badge>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Session 2026-2027 Admissions Deadline: <strong className="text-purple-300">{admissionLastDate}</strong>
                </p>
              </div>
            </div>

            <div className="text-xs text-slate-400 bg-[#12121e] px-4 py-2.5 rounded-xl border border-[#2a2a3e]">
              <span>Fee Vouchers are issued via campus accounts office by 5th of each calendar month.</span>
            </div>
          </div>
        </Card>

        {/* Read-Only Table */}
        <Table
          data={fees}
          columns={columns}
          pageSize={10}
          isLoading={isLoading}
          emptyMessage="No tuition fee schedules found."
        />
      </div>
    </PortalLayout>
  );
};
