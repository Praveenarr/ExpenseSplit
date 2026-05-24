import { useState } from 'react';
import { Modal } from './Modal';
import { TRIP_EMOJIS } from '../utils';

interface CreateTripModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (name: string, emoji: string) => void;
}

export function CreateTripModal({ open, onClose, onCreate }: CreateTripModalProps) {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(TRIP_EMOJIS[0]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), emoji);
    setName('');
    setEmoji(TRIP_EMOJIS[0]);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Trip ✈️">
      <div className="space-y-4">
        <div>
          <label className="label">Trip Name</label>
          <input
            className="input"
            placeholder="Goa Beach Trip, Manali 2025..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
        </div>
        <div>
          <label className="label">Pick an Emoji</label>
          <div className="flex flex-wrap gap-2">
            {TRIP_EMOJIS.map(em => (
              <button
                key={em}
                onClick={() => setEmoji(em)}
                className="text-2xl p-2 rounded-xl transition-all"
                style={{
                  background: emoji === em ? 'var(--accent-light)' : 'var(--surface2)',
                  border: emoji === em ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                {em}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button className="btn-ghost flex-1" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary flex-1 justify-center"
            onClick={handleSubmit}
            disabled={!name.trim()}
            style={{ opacity: !name.trim() ? 0.5 : 1 }}
          >
            Create Trip
          </button>
        </div>
      </div>
    </Modal>
  );
}
