
'use server';

import type { RouteConfig } from "@/lib/types";

// Mock database
let routes: RouteConfig[] = [];
let nextId = 1;

// Helper to create a delay to simulate network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


export async function getRoutes(): Promise<RouteConfig[]> {
  await delay(500); // Simulate network delay
  return routes;
}

export async function getRouteBySlug(slug: string): Promise<RouteConfig | undefined> {
  await delay(100);
  return routes.find(r => r.slug === slug);
}

interface CreateRouteInput {
    slug: string;
    realUrl: string;
    redirectBotTo: string;
    // ... and other properties from the form
}

interface CreateRouteResult {
    success: boolean;
    route?: RouteConfig;
    error?: string;
}

export async function createRoute(data: CreateRouteInput): Promise<CreateRouteResult> {
  await delay(1000); // Simulate network delay

  if (routes.some(route => route.slug === data.slug)) {
    return { success: false, error: 'Este slug já está em uso.' };
  }
  
  const newRoute: RouteConfig = {
    id: (nextId++).toString(),
    active: true,
    slug: data.slug,
    realUrl: data.realUrl,
    redirectBotTo: data.redirectBotTo,
    createdAt: new Date().toISOString(),
    totalAccesses: 0,
    botsBlocked: 0,
    template: '', // You can enhance this later
    // denyUserAgents: data.denyUserAgents, // Add these if you extend the type
    // denyIps: data.denyIps,
  };

  routes.push(newRoute);
  
  return { success: true, route: newRoute };
}

    