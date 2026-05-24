import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Trip, Member, Expense } from '../types';
import { MEMBER_COLORS } from '../utils';

interface AppState {
  trips: Trip[];
  activeTrip: string | null;
  darkMode: boolean;

  setDarkMode: (v: boolean) => void;
  setActiveTrip: (id: string | null) => void;

  createTrip: (name: string, emoji: string) => string;
  deleteTrip: (id: string) => void;

  addMember: (tripId: string, name: string) => void;
  removeMember: (tripId: string, memberId: string) => void;

  addExpense: (tripId: string, data: Omit<Expense, 'id' | 'createdAt'>) => string;
  updateExpense: (tripId: string, expenseId: string, data: Partial<Omit<Expense, 'id' | 'createdAt'>>) => void;
  deleteExpense: (tripId: string, expenseId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      trips: [],
      activeTrip: null,
      darkMode: false,

      setDarkMode: (v) => set({ darkMode: v }),
      setActiveTrip: (id) => set({ activeTrip: id }),

      createTrip: (name, emoji) => {
        const id = uuidv4();
        const trip: Trip = {
          id, name, emoji,
          members: [],
          expenses: [],
          createdAt: new Date().toISOString(),
        };
        set(s => ({ trips: [trip, ...s.trips] }));
        return id;
      },

      deleteTrip: (id) => set(s => ({
        trips: s.trips.filter(t => t.id !== id),
        activeTrip: s.activeTrip === id ? null : s.activeTrip,
      })),

      addMember: (tripId, name) => {
        const id = uuidv4();
        const colorIdx = Math.floor(Math.random() * MEMBER_COLORS.length);
        const member: Member = { id, name, color: MEMBER_COLORS[colorIdx] };
        set(s => ({
          trips: s.trips.map(t =>
            t.id === tripId ? { ...t, members: [...t.members, member] } : t
          ),
        }));
      },

      removeMember: (tripId, memberId) => set(s => ({
        trips: s.trips.map(t =>
          t.id === tripId
            ? { ...t, members: t.members.filter(m => m.id !== memberId) }
            : t
        ),
      })),

      addExpense: (tripId, data) => {
        const id = uuidv4();
        const expense: Expense = { ...data, id, createdAt: new Date().toISOString() };
        set(s => ({
          trips: s.trips.map(t =>
            t.id === tripId ? { ...t, expenses: [expense, ...t.expenses] } : t
          ),
        }));
        return id;
      },

      updateExpense: (tripId, expenseId, data) => set(s => ({
        trips: s.trips.map(t =>
          t.id === tripId
            ? {
                ...t,
                expenses: t.expenses.map(e =>
                  e.id === expenseId ? { ...e, ...data } : e
                ),
              }
            : t
        ),
      })),

      deleteExpense: (tripId, expenseId) => set(s => ({
        trips: s.trips.map(t =>
          t.id === tripId
            ? { ...t, expenses: t.expenses.filter(e => e.id !== expenseId) }
            : t
        ),
      })),
    }),
    { name: 'splittrip-data' }
  )
);
