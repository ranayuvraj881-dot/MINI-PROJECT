import { UserProfile, UserRole } from '../types';
import { apiClient } from './api';

const AUTH_STORAGE_KEY = 'glb_campusos_user';
const ROLE_STORAGE_KEY = 'glb_campusos_role';
const TOKEN_KEY = 'glb_auth_token';

export interface EnrolledStudentItem {
  id: string;
  name: string;
  rollNumber: string;
  collegeId: string;
  branch: string;
  semester: string;
  section: string;
}

export const authService = {
  /**
   * Retrieves list of all enrolled students from database for easy login selection.
   */
  async getEnrolledStudents(): Promise<EnrolledStudentItem[]> {
    try {
      return await apiClient<EnrolledStudentItem[]>('/auth/students');
    } catch (err) {
      console.warn('Failed to fetch public student roster:', err);
      return [];
    }
  },

  /**
   * Retrieves profile of currently authenticated student, faculty, or administrator.
   */
  async getCurrentUser(): Promise<UserProfile> {
    try {
      const user = await apiClient<UserProfile>('/auth/me');
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      localStorage.setItem(ROLE_STORAGE_KEY, user.role);
      return user;
    } catch (err) {
      // If cached profile exists in local storage, return as graceful fallback
      const cached = localStorage.getItem(AUTH_STORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          // ignore
        }
      }
      throw err;
    }
  },

  /**
   * Performs real login with roll number, name, collegeId, or email via POST /api/v1/auth/login
   */
  async login(
    credentials: string | { rollNumber?: string; name?: string; collegeId?: string; password?: string; role?: UserRole },
    password?: string,
    role: UserRole = 'student'
  ): Promise<UserProfile> {
    const payload =
      typeof credentials === 'string'
        ? {
            identifier: credentials,
            college_id: credentials,
            password: password || 'password123',
            role,
          }
        : {
            roll_number: credentials.rollNumber,
            name: credentials.name,
            college_id: credentials.collegeId,
            identifier: credentials.rollNumber || credentials.name || credentials.collegeId,
            password: credentials.password || 'password123',
            role: credentials.role || role,
          };

    const data = await apiClient<{ access_token: string; role: UserRole; user: UserProfile }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(ROLE_STORAGE_KEY, data.role);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));

    return data.user;
  },

  /**
   * Switches active role for demo / multi-role preview via POST /api/v1/auth/role-switch-demo
   */
  async switchRole(role: UserRole): Promise<UserProfile> {
    const data = await apiClient<{ access_token: string; role: UserRole; user: UserProfile }>('/auth/role-switch-demo', {
      method: 'POST',
      body: JSON.stringify({ role }),
    });

    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(ROLE_STORAGE_KEY, data.role);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data.user));

    return data.user;
  },

  /**
   * Updates student profile contact and personal details via PUT /api/v1/students/me
   */
  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const updated = await apiClient<UserProfile>('/students/me', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  /**
   * Logout user, notify backend, and clear active tokens.
   */
  async logout(): Promise<void> {
    try {
      await apiClient('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.setItem(ROLE_STORAGE_KEY, 'student');
    }
  }
};
