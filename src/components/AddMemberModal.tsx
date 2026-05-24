import { useState } from "react";
import { Modal } from "./Modal";
import { UserPlus } from "lucide-react";

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string) => void;
}

const SUGGESTIONS = [
  "Ajith",
  "Akash",
  "Bhunas",
  "Jawahar",
  "Magesh",
  "Praveen",
  "Raj",
  "Rakesh",
  "Sheik",
];

export function AddMemberModal({ open, onClose, onAdd }: AddMemberModalProps) {
  const [name, setName] = useState("");

  const handleAdd = (n: string) => {
    if (!n.trim()) return;
    onAdd(n.trim());
    setName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Member 👤">
      <div className="space-y-4">
        <div>
          <label className="label">Name</label>
          <input
            className="input"
            placeholder="Enter member name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd(name)}
            autoFocus
          />
        </div>
        <div>
          <label className="label">Quick Add</label>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleAdd(s)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: "var(--surface2)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <button className="btn-ghost flex-1" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-primary flex-1 justify-center"
            onClick={() => handleAdd(name)}
            disabled={!name.trim()}
            style={{ opacity: !name.trim() ? 0.5 : 1 }}
          >
            <UserPlus size={15} />
            Add Member
          </button>
        </div>
      </div>
    </Modal>
  );
}
