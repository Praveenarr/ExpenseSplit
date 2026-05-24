import type { Member, Expense } from '../types';
import { calculateSettlements, formatINR } from '../utils';
import { Avatar } from './Avatar';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface SettlementProps {
  members: Member[];
  expenses: Expense[];
}

export function SettlementSummary({ members, expenses }: SettlementProps) {
  const settlements = calculateSettlements(members, expenses);
  const getMember = (id: string) => members.find(m => m.id === id);

  if (settlements.length === 0) {
    return (
      <div className="card p-6 text-center">
        <CheckCircle size={32} className="mx-auto mb-2" style={{ color: '#22c55e' }} />
        <p className="font-semibold text-sm" style={{ color: 'var(--text)' }}>All settled up!</p>
        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>No pending payments</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {settlements.map((s, i) => {
        const from = getMember(s.from);
        const to = getMember(s.to);
        if (!from || !to) return null;
        return (
          <div key={i} className="card p-3 flex items-center gap-3">
            <Avatar name={from.name} color={from.color} size="sm" />
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: 'var(--text)' }}>
                <span style={{ color: from.color }}>{from.name}</span>
                <ArrowRight size={12} style={{ color: 'var(--text-muted)' }} />
                <span style={{ color: to.color }}>{to.name}</span>
              </div>
            </div>
            <span className="amount font-bold text-sm" style={{ color: '#ef4444' }}>
              {formatINR(s.amount)}
            </span>
            <Avatar name={to.name} color={to.color} size="sm" />
          </div>
        );
      })}
    </div>
  );
}
