import { useState } from 'react';
import { useAppStore } from '../store';
import { CreateTripModal } from '../components/CreateTripModal';
import { Plus, Moon, Sun, Wallet, Trash2, Calendar, Users } from 'lucide-react';
import { formatINR } from '../utils';

export function HomePage() {
  const { trips, darkMode, setDarkMode, createTrip, deleteTrip, setActiveTrip } = useAppStore();
  const [showCreate, setShowCreate] = useState(false);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-30 glass"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
              SplitTrip
            </h1>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Split expenses, not friendships 🤝</p>
          </div>
          <button onClick={toggleDark} className="btn-ghost p-2 rounded-full border-0">
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6">
        {/* Stats bar */}
        {trips.length > 0 && (
          <div
            className="card p-4 mb-6 flex items-center justify-between"
            style={{ background: 'var(--accent)', border: 'none' }}
          >
            <div>
              <p className="text-xs font-semibold text-amber-100">Total Trips</p>
              <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Playfair Display' }}>
                {trips.length}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-amber-100">Total Tracked</p>
              <p className="text-lg font-bold text-white amount">
                {formatINR(trips.reduce((sum, t) => sum + t.expenses.reduce((s, e) => s + e.amount, 0), 0))}
              </p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        )}

        {/* Trips grid */}
        {trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--text)' }}>
              No trips yet
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              Create your first trip and start tracking shared expenses
            </p>
            <button className="btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={16} /> Create Trip
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Your Trips</h2>
            </div>
            {trips.map((trip, idx) => {
              const total = trip.expenses.reduce((s, e) => s + e.amount, 0);
              return (
                <div
                  key={trip.id}
                  className="card p-4 cursor-pointer hover:shadow-float transition-all animate-slide-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                  onClick={() => setActiveTrip(trip.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ background: 'var(--accent-light)' }}
                    >
                      {trip.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base leading-tight" style={{ color: 'var(--text)', fontFamily: 'Playfair Display' }}>
                        {trip.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Users size={11} /> {trip.members.length} members
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Wallet size={11} /> {trip.expenses.length} expenses
                        </span>
                        <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                          <Calendar size={11} /> {new Date(trip.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="amount font-bold text-base" style={{ color: 'var(--accent)' }}>
                        {formatINR(total)}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>total</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex -space-x-2">
                      {trip.members.slice(0, 5).map(m => (
                        <div
                          key={m.id}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white border-2"
                          style={{ background: m.color, borderColor: 'var(--surface)' }}
                          title={m.name}
                        >
                          {m.name[0].toUpperCase()}
                        </div>
                      ))}
                      {trip.members.length > 5 && (
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2"
                          style={{ background: 'var(--border)', color: 'var(--text-muted)', borderColor: 'var(--surface)' }}
                        >
                          +{trip.members.length - 5}
                        </div>
                      )}
                    </div>
                    <button
                      className="p-1.5 rounded-lg text-xs transition-all"
                      style={{ color: '#ef4444' }}
                      onClick={e => { e.stopPropagation(); deleteTrip(trip.id); }}
                      title="Delete trip"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FAB */}
      {trips.length > 0 && (
        <button
          className="fixed bottom-6 right-6 btn-primary rounded-full shadow-glow text-base px-5 py-3"
          onClick={() => setShowCreate(true)}
        >
          <Plus size={20} /> New Trip
        </button>
      )}

      <CreateTripModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={(name, emoji) => {
          const id = createTrip(name, emoji);
          setActiveTrip(id);
        }}
      />
    </div>
  );
}
