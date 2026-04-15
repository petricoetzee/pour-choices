import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import type { DrinkType, DrinkEntry } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (entry: DrinkEntry) => void;
}

export function RetrospectiveModal({ isOpen, onClose, onAdd }: Props) {
  const [type, setType] = useState<DrinkType>('Beer');
  const [time, setTime] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!time) {
      alert("Please select a date and time");
      return;
    }
    
    // The visual local time format 'yyyy-MM-ddThh:mm' translates directly to local time,
    // so new Date(time) parses it according to local timezone.
    onAdd({
      id: uuidv4(),
      type,
      timestamp: new Date(time).toISOString()
    });
    
    // Reset and close
    setTime('');
    setType('Beer');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: '1rem' }}>Add Past Drink</h3>
        <form onSubmit={handleSubmit}>
          <select value={type} onChange={e => setType(e.target.value as DrinkType)}>
            <option value="Beer">Beer</option>
            <option value="Wine">Wine</option>
            <option value="Gin">Gin</option>
            <option value="Other">Other</option>
          </select>
          
          <input 
            type="datetime-local" 
            value={time}
            onChange={e => setTime(e.target.value)}
            max={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
          />
          
          <div className="flex-between">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn" style={{ background: 'var(--accent-gin)' }}>Add Drink</button>
          </div>
        </form>
      </div>
    </div>
  );
}
