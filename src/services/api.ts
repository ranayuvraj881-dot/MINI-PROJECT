/**
 * GL Bajaj CampusOS - Base API Client & Service Abstraction
 * 
 * Configured for seamless FastAPI backend integration.
 * In production/connected mode, points to VITE_API_BASE_URL (e.g. http://localhost:8000/api/v1).
 * In frontend-phase mode, resolves asynchronous realistic mock data with simulated latency.
 */

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';
export const USE_MOCK_FALLBACK = true; // Set to false when FastAPI backend is live

// Standard helper to simulate real HTTP latency (150ms - 300ms) for realistic UX and loading states
export async function simulateNetworkDelay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (!USE_MOCK_FALLBACK) {
    const token = localStorage.getItem('glb_auth_token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers as Record<string, string>),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'API Request failed' }));
      throw new Error(err.message || `HTTP ${response.status}`);
    }

    const json = await response.json();
    return json.data ?? json;
  }

  // If in mock phase, simulate network delay
  await simulateNetworkDelay();
  throw new Error(`Endpoint ${endpoint} called without mock handler`);
}
