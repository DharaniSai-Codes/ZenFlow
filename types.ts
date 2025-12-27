
export interface BlockedSite {
  id: string;
  domain: string;
  category: string;
  icon: string;
}

export interface FocusSession {
  id: string;
  timestamp: string;
  duration: number; // in minutes
  completed: boolean;
}

export type AppView = 'DASHBOARD' | 'STATS' | 'SETTINGS' | 'COACH';

export interface AIAdvice {
  message: string;
  motivation: string;
  strategy: string;
}
