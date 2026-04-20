import { useState } from 'react';
import type { DrinkEntry } from '../types';
import { getHistoricalReports, type WeeklyReport } from '../utils/stats';
import { ChevronDown, ChevronUp, CalendarDays } from 'lucide-react';

interface Props {
  entries: DrinkEntry[];
}

function ReportCard({ report }: { report: WeeklyReport }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="report-card glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
      <div 
        className="flex-between" 
        style={{ cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem', borderRadius: '12px' }}>
            <CalendarDays size={20} color="var(--accent-gin)" />
          </div>
          <div>
            <h4 style={{ margin: 0, fontWeight: 600 }}>{report.label}</h4>
            <span className="text-secondary" style={{ fontSize: '0.85rem' }}>Total: <strong style={{ color: '#fff' }}>{report.total}</strong> drinks</span>
          </div>
        </div>
        <div>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && (
        <div className="report-days mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
          {report.days.map((day, idx) => (
            <div key={idx} style={{ 
              background: day.count > 0 ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255,255,255,0.05)', 
              borderRadius: '8px', 
              padding: '0.5rem 0.25rem',
              border: day.count > 0 ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid transparent'
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{day.dateLabel}</div>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', minHeight: '1.5rem' }}>
                {day.count > 0 ? day.count : '-'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function HistoricalReporting({ entries }: Props) {
  const reports = getHistoricalReports(entries, 4); // showing up to 4 weeks back

  return (
    <div className="historical-reports mt-4 mb-4">
      <h3 className="mb-4">Past Weeks Recap</h3>
      {reports.map((r, i) => (
        <ReportCard key={i} report={r} />
      ))}
    </div>
  );
}
