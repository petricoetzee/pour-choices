import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Beer, Wine, Martini, Coffee, PlusCircle, Trash2 } from 'lucide-react';

import type { DrinkType } from './types';
import { useStorage } from './hooks/useStorage';
import { getStats } from './utils/stats';
import { RetrospectiveModal } from './components/RetrospectiveModal';
import { HistoricalReporting } from './components/HistoricalReporting';
import { DrinkConfirmationModal } from './components/DrinkConfirmationModal';

function App() {
  const { entries, addEntry, removeEntry, clearAllEntries } = useStorage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingDrinkType, setPendingDrinkType] = useState<DrinkType | null>(null);

  const { totalThisWeek, averagePerWeek, totalToday, totalLastWeekSameDay } = getStats(entries);

  const handleQuickAdd = (type: DrinkType) => {
    setPendingDrinkType(type);
  };

  const handleConfirmDrink = (inebriationLevel: number) => {
    if (pendingDrinkType) {
      addEntry({
        id: uuidv4(),
        type: pendingDrinkType,
        timestamp: new Date().toISOString(),
        inebriationLevel
      });
      setPendingDrinkType(null);
    }
  };

  const handleCancelDrink = () => {
    setPendingDrinkType(null);
  };

  return (
    <div>
      <div className="glass-panel text-center mb-4 title-card">
        <h1 className="neon-text">Pour Choices</h1>
        <p className="subtitle mt-4">For the refined (and unrefined) palate.</p>
      </div>

      <div className="stats-grid">
        <div className="glass-panel stat-card">
          <div className="stat-value">{totalToday}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value">{totalLastWeekSameDay}</div>
          <div className="stat-label">Last Week Same Day</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value">{totalThisWeek}</div>
          <div className="stat-label">This Week</div>
        </div>
        <div className="glass-panel stat-card">
          <div className="stat-value">{averagePerWeek}</div>
          <div className="stat-label">Avg / Wk</div>
        </div>
      </div>

      <div className="drink-grid">
        <button className="drink-btn btn-beer" onClick={() => handleQuickAdd('Beer')}>
          <Beer />
          <span>Beer</span>
        </button>
        <button className="drink-btn btn-wine" onClick={() => handleQuickAdd('Wine')}>
          <Wine />
          <span>Wine</span>
        </button>
        <button className="drink-btn btn-gin" onClick={() => handleQuickAdd('Gin')}>
          <Martini />
          <span>Gin</span>
        </button>
        <button className="drink-btn btn-other" onClick={() => handleQuickAdd('Other')}>
          <Coffee />
          <span>Other</span>
        </button>
      </div>

      <div className="glass-panel mb-4">
        <div className="flex-between mb-4">
          <h3>Recent Entries</h3>
          <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={18} />
            <span>Add Past Drink</span>
          </button>
        </div>

        {entries.length === 0 ? (
          <p className="text-center text-secondary">No drinks logged yet. Cheers to a fresh start!</p>
        ) : (
          <div className="history-list">
            {entries.slice(0, 15).map(entry => (
              <div className="history-item" key={entry.id}>
                <div className="drink-badge">
                  <div className={`badge-dot dot-${entry.type.toLowerCase()}`} />
                  <span>{entry.type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {entry.inebriationLevel !== undefined && (
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.1rem 0.4rem', 
                        borderRadius: '4px', 
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)' 
                      }}
                    >
                      Lvl {entry.inebriationLevel}
                    </span>
                  )}
                  <span className="text-secondary" style={{ fontSize: '0.875rem' }}>
                    {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
                  </span>
                  <button 
                    onClick={() => removeEntry(entry.id)}
                    style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                    title="Delete Entry"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <HistoricalReporting entries={entries} />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem', marginBottom: '2rem' }}>
        <button 
          className="btn" 
          style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444' }}
          onClick={() => {
            if (window.confirm("Are you sure you want to reset everything back to zero? This cannot be undone.")) {
              clearAllEntries();
            }
          }}
        >
          Reset All Data
        </button>
      </div>

      <RetrospectiveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addEntry} 
      />

      <DrinkConfirmationModal
        isOpen={pendingDrinkType !== null}
        drinkType={pendingDrinkType}
        onConfirm={handleConfirmDrink}
        onCancel={handleCancelDrink}
      />
    </div>
  );
}

export default App;
