import type { Expense, Member, MemberBalance, Settlement } from '../types';

export const MEMBER_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e',
  '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
  '#14b8a6', '#f43f5e',
];

export const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string }> = {
  food: { label: 'Food & Drinks', emoji: '🍽️', color: '#f97316' },
  transport: { label: 'Transport', emoji: '🚗', color: '#3b82f6' },
  stay: { label: 'Stay', emoji: '🏨', color: '#8b5cf6' },
  activities: { label: 'Activities', emoji: '🎭', color: '#22c55e' },
  shopping: { label: 'Shopping', emoji: '🛍️', color: '#ec4899' },
  other: { label: 'Other', emoji: '💡', color: '#6b7280' },
};

export const TRIP_EMOJIS = ['✈️', '🏕️', '🏖️', '🗺️', '🏔️', '🚢', '🎡', '🎿', '🌴', '🏯'];

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getMemberBalances(members: Member[], expenses: Expense[]): MemberBalance[] {
  const balances: Record<string, MemberBalance> = {};
  members.forEach(m => {
    balances[m.id] = { memberId: m.id, paid: 0, owes: 0, net: 0 };
  });

  expenses.forEach(exp => {
    const splitAmount = exp.amount / exp.members.length;
    if (balances[exp.paidBy]) {
      balances[exp.paidBy].paid += exp.amount;
    }
    exp.members.forEach(mId => {
      if (balances[mId]) {
        balances[mId].owes += splitAmount;
      }
    });
  });

  Object.values(balances).forEach(b => {
    b.net = b.paid - b.owes;
  });

  return Object.values(balances);
}

export function calculateSettlements(members: Member[], expenses: Expense[]): Settlement[] {
  const balances = getMemberBalances(members, expenses);
  const settlements: Settlement[] = [];

  const creditors = balances.filter(b => b.net > 0).sort((a, b) => b.net - a.net);
  const debtors = balances.filter(b => b.net < 0).sort((a, b) => a.net - b.net);

  let i = 0, j = 0;
  const creds = creditors.map(c => ({ ...c }));
  const debts = debtors.map(d => ({ ...d }));

  while (i < creds.length && j < debts.length) {
    const amount = Math.min(creds[i].net, -debts[j].net);
    if (amount > 0.01) {
      settlements.push({ from: debts[j].memberId, to: creds[i].memberId, amount: Math.round(amount * 100) / 100 });
    }
    creds[i].net -= amount;
    debts[j].net += amount;
    if (Math.abs(creds[i].net) < 0.01) i++;
    if (Math.abs(debts[j].net) < 0.01) j++;
  }

  return settlements;
}

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
