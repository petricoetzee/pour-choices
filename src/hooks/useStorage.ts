import { useState, useEffect } from 'react';
import type { DrinkEntry } from '../types';

const STORAGE_KEY = 'tracker_drinks_data';

export function useStorage() {
  const [entries, setEntries] = useState<DrinkEntry[]>([]);

  useEffect(() => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        // Sort descending by date immediately on load
        const parsed: DrinkEntry[] = JSON.parse(data);
        parsed.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setEntries(parsed);
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
  }, []);

  const addEntry = (entry: DrinkEntry) => {
    const newEntries = [...entries, entry].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  const removeEntry = (id: string) => {
    const newEntries = entries.filter((e) => e.id !== id);
    setEntries(newEntries);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newEntries));
  };

  return { entries, addEntry, removeEntry };
}
