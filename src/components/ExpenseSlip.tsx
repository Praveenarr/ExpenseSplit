import { useState } from 'react';
import type { Expense, Member } from '../types';
import { CATEGORY_CONFIG, formatINR, formatDate } from '../utils';
import { Avatar } from './Avatar';
import { MoreVertical, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface ExpenseSlipProps {
  expense: Expense;
  members: Member[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseSlip({ expense, members, onEdit, onDelete }: ExpenseSlipProps) {
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const paidByMember = members.find(m => m.id === expense.paidBy);
  const involvedMembers = members.filter(m => expense.members.includes(m.id));
  const perPerson = expense.amount / expense.members.length;
  const cfg = CATEGORY_CONFIG[expense.category] || CATEGORY_CONFIG.other;

  return (
    <div className="card p-4 animate-slide-up">
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
          style={{ background: cfg.color + '20' }}
        >
          {cfg.emoji}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-sm leading-tight" style={{ color: 'var(--text)' }}>
                {expense.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="tag" style={{ background: cfg.color + '15', color: cfg.color }}>
                  {cfg.emoji} {cfg.label}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(expense.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <span className="amount font-bold text-base" style={{ color: 'var(--text)' }}>
                {formatINR(expense.amount)}
              </span>
              <div className="relative">
                <button
                  className="p-1 rounded-lg transition-all"
                  style={{ color: 'var(--text-muted)' }}
                  onClick={() => setMenuOpen(p => !p)}
                >
                  <MoreVertical size={16} />
                </button>
                {menuOpen && (
                  <div
                    className="absolute right-0 top-8 z-10 rounded-xl shadow-float py-1 min-w-[120px] animate-scale-in"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors"
                      style={{ color: 'var(--text)' }}
                      onClick={() => { setMenuOpen(false); onEdit(expense); }}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm transition-colors"
                      style={{ color: '#ef4444' }}
                      onClick={() => { setMenuOpen(false); onDelete(expense.id); }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2">
            {paidByMember && (
              <div className="flex items-center gap-1.5">
                <Avatar name={paidByMember.name} color={paidByMember.color} size="sm" />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  <span style={{ color: paidByMember.color, fontWeight: 600 }}>{paidByMember.name}</span> paid
                </span>
              </div>
            )}
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>·</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="amount font-medium" style={{ color: 'var(--accent)' }}>
                {formatINR(perPerson)}
              </span> each
            </span>
          </div>
        </div>
      </div>

      <button
        className="flex items-center gap-1 mt-3 text-xs font-medium transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex -space-x-1.5 mr-1">
          {involvedMembers.slice(0, 5).map(m => (
            <Avatar key={m.id} name={m.name} color={m.color} size="sm" />
          ))}
          {involvedMembers.length > 5 && (
            <div className="avatar w-7 h-7 text-xs" style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
              +{involvedMembers.length - 5}
            </div>
          )}
        </div>
        {involvedMembers.length} people · {expanded ? 'Hide' : 'See'} split
        {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {expanded && (
        <div
          className="mt-3 rounded-xl p-3 animate-slide-down"
          style={{ background: 'var(--surface2)' }}
        >
          {expense.description && (
            <p className="text-xs mb-2 italic" style={{ color: 'var(--text-muted)' }}>"{expense.description}"</p>
          )}
          <div className="space-y-2">
            {involvedMembers.map(m => (
              <div key={m.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar name={m.name} color={m.color} size="sm" />
                  <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>{m.name}</span>
                  {m.id === expense.paidBy && (
                    <span className="tag" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>paid</span>
                  )}
                </div>
                <span className="amount text-xs font-semibold" style={{ color: 'var(--text)' }}>
                  {formatINR(perPerson)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
