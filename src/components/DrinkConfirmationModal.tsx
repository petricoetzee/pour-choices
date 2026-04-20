import { useState, useEffect } from 'react';
import type { DrinkType } from '../types';

interface DrinkConfirmationModalProps {
  isOpen: boolean;
  drinkType: DrinkType | null;
  onConfirm: (level: number) => void;
  onCancel: () => void;
}

const QUOTES = [
  "True enjoyment comes from within.",
  "Pause, breathe, and reflect: is this the right choice?",
  "Mindful drinking is about quality, not quantity.",
  "Your future self is watching you through memories.",
  "A momentary pause can prevent a morning's regret.",
  "Will the next drink add to the joy of the evening?",
  "Observe the craving, and let it pass like a cloud.",
  "You don't need a drink to feel complete right now.",
  "Notice how you feel in this very moment. Is it enough?",
  "Drink in the present, without pouring another glass.",
  "Consider the weight of tomorrow morning.",
  "Will you thank yourself for this one?",
  "The best nights are those you fully remember.",
  "You've had enough to be happy, why risk anything else?",
  "Is it thirst, habit, or emotion?",
  "Embrace the clarity of saying no."
];

export function DrinkConfirmationModal({ isOpen, drinkType, onConfirm, onCancel }: DrinkConfirmationModalProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
    }
  }, [isOpen]);

  if (!isOpen || !drinkType) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel" style={{ maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }}>
        <h2 className="neon-text" style={{ fontSize: '1.5rem', marginTop: 0 }}>Mindful Moment</h2>
        
        <p className="text-secondary" style={{ fontStyle: 'italic', minHeight: '3rem', margin: 0 }}>
          "{quote}"
        </p>

        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
          <p className="mb-4" style={{ marginTop: 0 }}>How inebriated are you feeling?</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            {[1, 2, 3, 4, 5].map(level => (
              <button 
                key={level}
                className="btn"
                style={{ 
                  width: '45px', 
                  height: '45px', 
                  padding: 0, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: level >= 4 ? 'rgba(239, 68, 68, 0.1)' : level <= 2 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${level >= 4 ? 'rgba(239, 68, 68, 0.3)' : level <= 2 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
                  fontSize: '1.2rem',
                  fontWeight: 'bold'
                }}
                onClick={() => onConfirm(level)}
                title={level === 1 ? 'Sober' : level === 5 ? 'Legless' : `Level ${level}`}
              >
                {level}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="text-secondary">
            <span>Sober</span>
            <span>Legless</span>
          </div>
        </div>

        <button 
          className="btn" 
          onClick={onCancel}
          style={{ background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#ef4444' }}
        >
          Opt-Out (Cancel Drink)
        </button>
      </div>
    </div>
  );
}
