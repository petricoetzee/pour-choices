import type { DrinkEntry } from '../types';
import { startOfWeek, endOfWeek, differenceInWeeks, isWithinInterval, subWeeks, eachDayOfInterval, format, isSameDay } from 'date-fns';

export function getStats(entries: DrinkEntry[]) {
  if (entries.length === 0) {
    return { totalThisWeek: 0, totalLastWeek: 0, totalToday: 0, totalLastWeekSameDay: 0 };
  }

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  // Drinks this week
  const thisWeekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return isWithinInterval(entryDate, { start: weekStart, end: weekEnd });
  });

  // Drinks last week
  const lastWeekStart = startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 });
  const lastWeekEntries = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp);
    return isWithinInterval(entryDate, { start: lastWeekStart, end: lastWeekEnd });
  });
  const totalLastWeek = lastWeekEntries.length;

  const todayEntries = entries.filter((entry) => isSameDay(new Date(entry.timestamp), now));
  const totalToday = todayEntries.length;

  const lastWeekSameDay = subWeeks(now, 1);
  const lastWeekSameDayEntries = entries.filter((entry) => isSameDay(new Date(entry.timestamp), lastWeekSameDay));
  const totalLastWeekSameDay = lastWeekSameDayEntries.length;

  return {
    totalThisWeek: thisWeekEntries.length,
    totalLastWeek,
    totalToday,
    totalLastWeekSameDay
  };
}

export interface DailyCount {
  dateLabel: string;
  count: number;
}

export interface WeeklyReport {
  label: string;
  total: number;
  days: DailyCount[];
}

export function getHistoricalReports(entries: DrinkEntry[], weeksBack = 3): WeeklyReport[] {
  const reports: WeeklyReport[] = [];
  const now = new Date();

  // Loop through past N weeks (1 = last week, 2 = week before that)
  for (let i = 1; i <= weeksBack; i++) {
    const targetDate = subWeeks(now, i);
    const start = startOfWeek(targetDate, { weekStartsOn: 1 });
    const end = endOfWeek(targetDate, { weekStartsOn: 1 });

    const daysInterval = eachDayOfInterval({ start, end });
    const days: DailyCount[] = daysInterval.map(day => {
      const dayEntries = entries.filter(e => isSameDay(new Date(e.timestamp), day));
      return {
        dateLabel: format(day, 'EEE'), // e.g., Mon, Tue
        count: dayEntries.length
      };
    });

    const total = days.reduce((sum, d) => sum + d.count, 0);
    
    reports.push({
      label: i === 1 ? 'Last Week' : `${i} Weeks Ago`,
      total,
      days
    });
  }

  return reports;
}
