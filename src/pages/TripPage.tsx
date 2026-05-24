import { useState } from 'react';
import { useAppStore } from '../store';
import { ExpenseSlip } from '../components/ExpenseSlip';
import { ExpenseModal } from '../components/ExpenseModal';
import { AddMemberModal } from '../components/AddMemberModal';
import { SettlementSummary } from '../components/SettlementSummary';
import { Avatar } from '../components/Avatar';
import type { Expense } from '../types';
import { ArrowLeft, Plus, UserPlus, Search, Sun, Moon, X } from 'lucide-react';
import { formatINR, getMemberBalances, CATEGORY_CONFIG } from '../utils';
import toast from 'react-hot-toast';

export function TripPage() {
  const { trips, activeTrip, setActiveTrip, addMember, removeMember,
    addExpense, updateExpense, deleteExpense, darkMode, setDarkMode } = useAppStore();
  const trip = trips.find(t => t.id === activeTrip);

  const [tab, setTab] = useState<'expenses' | 'members' | 'summary'>('expenses');
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');

  if (!trip) return null;

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const filtered = trip.expenses.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      (e.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchCat = filterCat === 'all' || e.category === filterCat;
    return matchSearch && matchCat;
  });

  const totalAmount = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const balances = getMemberBalances(trip.members, trip.expenses);

  const handleAddExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    addExpense(trip.id, data);
    toast.success('Expense added! 💸');
  };

  const handleUpdateExpense = (data: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!editExpense) return;
    updateExpense(trip.id, editExpense.id, data);
    setEditExpense(null);
    toast.success('Expense updated ✅');
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(trip.id, id);
    toast.success('Expense deleted');
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <header className="sticky top-0 z-30 glass" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button className="btn-ghost p-2 rounded-full border-0" onClick={() => setActiveTrip(null)}>
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xl">{trip.emoji}</span>
                <h1 className="font-bold text-base truncate" style={{ fontFamily: 'Playfair Display', color: 'var(--text)' }}>
                  {trip.name}
                </h1>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {trip.members.length} members · {trip.expenses.length} expenses
              </p>
            </div>
            <button onClick={toggleDark} className="btn-ghost p-2 rounded-full border-0">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          <div className="flex gap-1 mt-3 p-1 rounded-xl" style={{ background: 'var(--surface2)' }}>
            {(['expenses', 'members', 'summary'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all"
                style={{
                  background: tab === t ? 'var(--surface)' : 'transparent',
                  color: tab === t ? 'var(--accent)' : 'var(--text-muted)',
                  boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {t === 'expenses' ? '💸' : t === 'members' ? '👥' : '📊'} {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-4 pb-28">
        {/* EXPENSES TAB */}
        {tab === 'expenses' && (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="card p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Total</p>
                <p className="amount font-bold text-lg" style={{ color: 'var(--accent)' }}>{formatINR(totalAmount)}</p>
              </div>
              <div className="card p-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Per Person</p>
                <p className="amount font-bold text-lg" style={{ color: 'var(--text)' }}>
                  {trip.members.length > 0 ? formatINR(totalAmount / trip.members.length) : '₹0'}
                </p>
              </div>
            </div>

            {trip.expenses.length > 0 && (
              <div className="mb-4 space-y-2">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    className="input pl-9"
                    placeholder="Search expenses..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                  {search && (
                    <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => setSearch('')}>
                      <X size={14} style={{ color: 'var(--text-muted)' }} />
                    </button>
                  )}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => setFilterCat('all')}
                    className="tag flex-shrink-0"
                    style={{
                      background: filterCat === 'all' ? 'var(--accent)' : 'var(--surface2)',
                      color: filterCat === 'all' ? 'white' : 'var(--text-muted)',
                    }}
                  >
                    All
                  </button>
                  {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => setFilterCat(k)}
                      className="tag flex-shrink-0"
                      style={{
                        background: filterCat === k ? v.color : 'var(--surface2)',
                        color: filterCat === k ? 'white' : 'var(--text-muted)',
                      }}
                    >
                      {v.emoji} {v.label.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">💸</div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>
                  {trip.expenses.length === 0 ? 'No expenses yet' : 'No results found'}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {trip.expenses.length === 0
                    ? trip.members.length === 0
                      ? 'Add members first, then track expenses'
                      : 'Tap + to add your first expense'
                    : 'Try a different search'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(e => (
                  <ExpenseSlip
                    key={e.id}
                    expense={e}
                    members={trip.members}
                    onEdit={exp => { setEditExpense(exp); setShowAddExpense(true); }}
                    onDelete={handleDeleteExpense}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* MEMBERS TAB */}
        {tab === 'members' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold" style={{ fontFamily: 'Playfair Display', color: 'var(--text)' }}>
                Members ({trip.members.length})
              </h2>
              <button className="btn-primary" onClick={() => setShowAddMember(true)}>
                <UserPlus size={14} /> Add
              </button>
            </div>

            {trip.members.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">👥</div>
                <p className="font-semibold" style={{ color: 'var(--text)' }}>No members yet</p>
                <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-muted)' }}>Add friends to start splitting expenses</p>
                <button className="btn-primary" onClick={() => setShowAddMember(true)}>
                  <UserPlus size={14} /> Add First Member
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {trip.members.map(m => {
                  const balance = balances.find(b => b.memberId === m.id);
                  return (
                    <div key={m.id} className="card p-4 flex items-center gap-3">
                      <Avatar name={m.name} color={m.color} size="lg" />
                      <div className="flex-1">
                        <p className="font-semibold" style={{ color: 'var(--text)' }}>{m.name}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Paid: <span className="amount font-medium" style={{ color: '#22c55e' }}>{formatINR(balance?.paid || 0)}</span>
                          </span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Owes: <span className="amount font-medium" style={{ color: '#ef4444' }}>{formatINR(balance?.owes || 0)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: 'var(--text-muted)' }}>Net</p>
                        <p
                          className="amount font-bold text-sm"
                          style={{ color: (balance?.net || 0) >= 0 ? '#22c55e' : '#ef4444' }}
                        >
                          {(balance?.net || 0) >= 0 ? '+' : ''}{formatINR(balance?.net || 0)}
                        </p>
                      </div>
                      <button
                        className="p-1.5 rounded-lg transition-all ml-1"
                        style={{ color: '#ef4444' }}
                        onClick={() => {
                          removeMember(trip.id, m.id);
                          toast.success(`${m.name} removed`);
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUMMARY TAB */}
        {tab === 'summary' && (
          <div className="space-y-5">
            <div
              className="card p-5 text-center"
              style={{ background: 'var(--accent)', border: 'none' }}
            >
              <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider mb-1">Total Trip Expense</p>
              <p className="amount text-3xl font-bold text-white" style={{ fontFamily: 'Playfair Display' }}>
                {formatINR(totalAmount)}
              </p>
              <p className="text-amber-100 text-xs mt-1">{trip.expenses.length} expenses · {trip.members.length} members</p>
            </div>

            <div>
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Playfair Display', color: 'var(--text)' }}>
                💳 Contributions
              </h3>
              {balances.length === 0 ? (
                <p className="text-sm text-center py-4" style={{ color: 'var(--text-muted)' }}>Add members and expenses to see balances</p>
              ) : (
                <div className="space-y-2">
                  {balances.sort((a, b) => b.paid - a.paid).map(b => {
                    const member = trip.members.find(m => m.id === b.memberId);
                    if (!member) return null;
                    const pct = totalAmount > 0 ? (b.paid / totalAmount) * 100 : 0;
                    return (
                      <div key={b.memberId} className="card p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar name={member.name} color={member.color} size="sm" />
                          <span className="font-medium text-sm flex-1" style={{ color: 'var(--text)' }}>{member.name}</span>
                          <span className="amount font-bold text-sm" style={{ color: 'var(--text)' }}>{formatINR(b.paid)}</span>
                        </div>
                        <div className="w-full rounded-full h-1.5" style={{ background: 'var(--surface2)' }}>
                          <div
                            className="h-1.5 rounded-full transition-all"
                            style={{ width: `${pct}%`, background: member.color }}
                          />
                        </div>
                        <div className="flex justify-between mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <span>Owes: <span className="amount">{formatINR(b.owes)}</span></span>
                          <span
                            className="font-semibold"
                            style={{ color: b.net >= 0 ? '#22c55e' : '#ef4444' }}
                          >
                            {b.net >= 0 ? '▲' : '▼'} {formatINR(Math.abs(b.net))}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-bold mb-3" style={{ fontFamily: 'Playfair Display', color: 'var(--text)' }}>
                🤝 Who Pays Whom
              </h3>
              <SettlementSummary members={trip.members} expenses={trip.expenses} />
            </div>
          </div>
        )}
      </main>

      {tab === 'expenses' && trip.members.length > 0 && (
        <button
          className="fixed bottom-6 right-6 btn-primary rounded-full shadow-glow text-base px-5 py-3 z-20"
          onClick={() => { setEditExpense(null); setShowAddExpense(true); }}
        >
          <Plus size={20} /> Add Expense
        </button>
      )}

      {tab === 'members' && (
        <button
          className="fixed bottom-6 right-6 btn-primary rounded-full shadow-glow text-base px-5 py-3 z-20"
          onClick={() => setShowAddMember(true)}
        >
          <UserPlus size={18} /> Add Member
        </button>
      )}

      <AddMemberModal
        open={showAddMember}
        onClose={() => setShowAddMember(false)}
        onAdd={name => {
          addMember(trip.id, name);
          toast.success(`${name} added to trip! 👋`);
        }}
      />

      <ExpenseModal
        open={showAddExpense}
        onClose={() => { setShowAddExpense(false); setEditExpense(null); }}
        members={trip.members}
        tripId={trip.id}
        onSave={editExpense ? handleUpdateExpense : handleAddExpense}
        editExpense={editExpense}
      />
    </div>
  );
}
