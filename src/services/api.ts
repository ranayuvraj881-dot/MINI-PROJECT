/**
 * GL Bajaj CampusOS - Base API Client & Service Abstraction
 * 
 * Connected to FastAPI backend with PostgreSQL / SQLite.
 * Uses VITE_API_BASE_URL (defaults to http://localhost:8000/api/v1).
 */

export const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
export const USE_MOCK_FALLBACK = false; // Strictly connected to real FastAPI backend

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('glb_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  // Ensure endpoint starts with / if not already
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${normalizedEndpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('glb_auth_token');
      }
      const err = await response.json().catch(() => ({ detail: `HTTP ${response.status}: API request failed` }));
      const errorMsg = err.detail || err.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    const json = await response.json();
    return json.data ?? json;
  } catch (error: any) {
    console.error(`API Error on [${options.method || 'GET'} ${normalizedEndpoint}]:`, error);
    throw error;
  }
}
