
'use server';

import type { LogEntry } from "@/lib/types";

// Mock database for logs
let logs: LogEntry[] = [];
let nextLogId = 1;

// Helper to create a delay to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

interface LogAccessInput {
    ip: string;
    userAgent: string;
    route: string;
    type: 'human' | 'bot';
    botType?: string;
}

export async function logAccess(data: LogAccessInput): Promise<void> {
    // In a real app, you'd save this to a database (e.g., Firestore, PostgreSQL)
    const newLog: LogEntry = {
        id: (nextLogId++).toString(),
        ...data,
        timestamp: new Date().toISOString(),
    };
    logs.unshift(newLog); // Add to the beginning of the array
    
    // Keep the logs array from growing indefinitely in this mock setup
    if (logs.length > 100) {
        logs.pop();
    }
}

export interface DashboardStats {
    totalAccesses: number;
    botsBlocked: number;
    humanAccesses: number;
    activeRoutes: number;
    recentLogs: LogEntry[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
    await delay(500); // Simulate network delay
    
    const botsBlocked = logs.filter(log => log.type === 'bot').length;
    const humanAccesses = logs.filter(log => log.type === 'human').length;
    
    // In a real app, you'd fetch this from the routes table/collection
    const { getRoutes } = await import('./routes/actions');
    const allRoutes = await getRoutes();
    const activeRoutes = allRoutes.filter(r => r.active).length;


    return {
        totalAccesses: logs.length,
        botsBlocked,
        humanAccesses,
        activeRoutes,
        recentLogs: logs.slice(0, 50), // Return the 50 most recent logs
    };
}
