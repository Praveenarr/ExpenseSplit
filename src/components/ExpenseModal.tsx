import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Member, Expense, Category } from '../types';
import { CATEGORY_CONFIG } from '../utils';
import { Avatar } from './Avatar';

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  tripId: string;
  onSave: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  editExpense?: Expense | null;
}

const today = () => new Date().toISOString().slice(0, 10);

export function ExpenseModal({ open, onClose, members, onSave, editExpense }: ExpenseModalProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today());
  const [category, setCategory] = useState<Category>('other');
  const [involvedMembers, setInvolvedMembers] = useState<string[]>([]);

  useEffect(() => {
    if (editExpense) {
      setTitle(editExpense.title);
      setAmount(String(editExpense.amount));
      setPaidBy(editExpense.paidBy);
      setDescription(editExpense.description || '');
      setDate(editExpense.date);
      setCategory(editExpense.category);
      setInvolvedMembers(editExpense.members);
    } else {
      setTitle('');
      setAmount('');
      setPaidBy(members[0]?.id || '');
      setDescription('');
      setDate(today());
      setCategory('other');
      setInvolvedMembers(members.map(m => m.id));
    }
  }, [editExpense, members, open]);

  const toggleMember = (id: string) => {
    setInvolvedMembers(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const isValid = title.trim() && amount && Number(amount) > 0 && paidBy && involvedMembers.length > 0;

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      title: title.trim(),
      amount: Number(amount),
      paidBy,
      description: description.trim(),
      date,
      category,
      members: involvedMembers,
    });
    onClose();
  };

  const perPerson = involvedMembers.length > 0 && Number(amount) > 0
    ? (Number(amount) / involvedMembers.length).toFixed(2)
    : null;

  return (
    <Modal open={open} onClose={onClose} title={editExpense ? 'Edit Expense ✏️' : 'Add Expense 💸'}>
      <div className="space-y-4">
        <div>
          <label className="label">Title</label>
          <input className="input" placeholder="Dinner at Cafe, Auto ride..." value={title} onChange={e => setTitle(e.target.value)} autoFocus />
        </div>

        <div>
          <label className="label">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--accent)' }}>₹</span>
            <input
              className="input pl-8"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="label">Category</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setCategory(key as Category)}
                className="flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: category === key ? 'var(--accent-light)' : 'var(--surface2)',
                  border: category === key ? `2px solid var(--accent)` : '2px solid transparent',
                  color: category === key ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                <span className="text-lg">{cfg.emoji}</span>
                {cfg.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Paid By</label>
          <div className="flex flex-wrap gap-2">
            {members.map(m => (
              <button
                key={m.id}
                onClick={() => setPaidBy(m.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: paidBy === m.id ? m.color + '20' : 'var(--surface2)',
                  border: paidBy === m.id ? `2px solid ${m.color}` : '2px solid transparent',
                  color: paidBy === m.id ? m.color : 'var(--text-muted)',
                }}
              >
                <Avatar name={m.name} color={m.color} size="sm" />
                {m.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Split Among</label>
            {perPerson && (
              <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
                ₹{perPerson} / person
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {members.map(m => {
              const active = involvedMembers.includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMember(m.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: active ? m.color + '20' : 'var(--surface2)',
                    border: active ? `2px solid ${m.color}` : '2px solid transparent',
                    color: active ? m.color : 'var(--text-muted)',
                    opacity: active ? 1 : 0.5,
                  }}
                >
                  <Avatar name={m.name} color={m.color} size="sm" />
                  {m.name}
                </button>
              );
            })}
          </div>
          <button
            className="mt-2 text-xs underline"
            style={{ color: 'var(--accent)' }}
            onClick={() => setInvolvedMembers(
              involvedMembers.length === members.length ? [] : members.map(m => m.id)
            )}
          >
            {involvedMembers.length === members.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div>
          <label className="label">Date</label>
          <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
        </div>

        <div>
          <label className="label">Note (optional)</label>
          <textarea
            className="input resize-none"
            rows={2}
            placeholder="Any notes..."
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button className="btn-ghost flex-1" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary flex-1 justify-center"
            onClick={handleSave}
            disabled={!isValid}
            style={{ opacity: !isValid ? 0.5 : 1 }}
          >
            {editExpense ? 'Update' : 'Add Expense'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
