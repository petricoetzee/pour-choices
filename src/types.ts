export type DrinkType = 'Beer' | 'Wine' | 'Gin' | 'Other';

export interface DrinkEntry {
  id: string;
  type: DrinkType;
  timestamp: string; // ISO string
  inebriationLevel?: number;
}
