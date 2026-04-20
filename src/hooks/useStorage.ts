import { useState, useEffect } from 'react';
import type { DrinkEntry } from '../types';
import { supabase } from '../lib/supabase';

export function useStorage() {
  const [entries, setEntries] = useState<DrinkEntry[]>([]);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from('drinks')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error("Error fetching from Supabase", error);
    } else if (data) {
      setEntries(data as DrinkEntry[]);
    }
  };

  const addEntry = async (entry: DrinkEntry) => {
    // Optimistic UI update
    const newEntries = [...entries, entry].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setEntries(newEntries);

    // Persist to Supabase
    const { error } = await supabase.from('drinks').insert([entry]);
    if (error) {
      console.error("Failed to insert into Supabase", error);
    }
  };

  const removeEntry = async (id: string) => {
    // Optimistic UI update
    const newEntries = entries.filter((e) => e.id !== id);
    setEntries(newEntries);

    // Delete from Supabase
    const { error } = await supabase.from('drinks').delete().eq('id', id);
    if (error) {
      console.error("Failed to delete from Supabase", error);
    }
  };

  const clearAllEntries = async () => {
    setEntries([]);
    const { error } = await supabase.from('drinks').delete().neq('id', '0');
    if (error) {
      console.error("Failed to clear Supabase", error);
    }
  };

  return { entries, addEntry, removeEntry, clearAllEntries };
}
