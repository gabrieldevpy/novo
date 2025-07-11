export interface LogEntry {
  id: string;
  ip: string;
  userAgent: string;
  route: string;
  type: 'human' | 'bot';
  botType?: string;
  timestamp: string;
}

export interface RouteConfig {
  id: string;
  slug: string;
  redirectBotTo: string;
  active: boolean;
  template: string;
  createdAt: string;
  totalAccesses: number;
  botsBlocked: number;
}
