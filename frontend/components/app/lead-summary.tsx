'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export interface LeadDetails {
  name: string;
  company: string;
  email: string;
  role: string;
  useCase: string;
  teamSize: string;
  timeline: string;
  budget?: string;
  notes?: string[];
}

type LeadFieldKey =
  | 'name'
  | 'company'
  | 'email'
  | 'role'
  | 'useCase'
  | 'teamSize'
  | 'timeline'
  | 'budget';

interface LeadSummaryProps {
  lead: LeadDetails;
  className?: string;
}

const fields: Array<[LeadFieldKey, string]> = [
  ['name', 'Lead name'],
  ['company', 'Company'],
  ['email', 'Email'],
  ['role', 'Role'],
  ['useCase', 'Use case'],
  ['teamSize', 'Team size'],
  ['timeline', 'Timeline'],
  ['budget', 'Budget'],
];

export function LeadSummary({ lead, className }: LeadSummaryProps) {
  return (
    <motion.div
      className={cn(
        'rounded-3xl border border-cyan-200/30 bg-slate-900/70 backdrop-blur-2xl p-8 text-white shadow-[0_30px_120px_rgba(8,47,73,0.45)] max-w-md',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mb-6 pb-4 border-b border-cyan-200/20">
        <h2 className="text-2xl font-bold tracking-tight">Qualified lead snapshot</h2>
        <p className="text-cyan-100/80 text-sm">
          Auto-saved to CRM and shared with the sales pod.
        </p>
      </div>

      <div className="space-y-3">
        {fields.map(([key, label]) => {
          const value = lead[key];
          if (!value) return null;
          return (
            <div key={key} className="flex flex-col rounded-2xl bg-white/5 px-4 py-3 border border-white/5">
              <span className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">{label}</span>
              <span className="text-lg font-semibold">{value}</span>
            </div>
          );
        })}
      </div>

      {lead.notes && lead.notes.length > 0 && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80 mb-2">Notes</p>
          <ul className="space-y-2 text-sm text-slate-100 list-disc list-inside">
            {lead.notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
}


