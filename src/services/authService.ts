import { UserProfile, UserRole } from '../types';
import { mockAdminUser, mockCurrentStudent, mockFacultyUser } from '../data/mock/mockStudents';
import { simulateNetworkDelay } from './api';

const AUTH_STORAGE_KEY = 'glb_campusos_user';
const ROLE_STORAGE_KEY = 'glb_campusos_role';

export const authService = {
  async getCurrentUser(): Promise<UserProfile> {
    await simulateNetworkDelay(120);
    const storedRole = (localStorage.getItem(ROLE_STORAGE_KEY) as UserRole) || 'student';
    
    if (storedRole === 'faculty') {
      return mockFacultyUser;
    }
    if (storedRole === 'admin') {
      return mockAdminUser;
    }
    return mockCurrentStudent;
  },

  async login(collegeId: string, _password: string, role: UserRole = 'student'): Promise<UserProfile> {
    await simulateNetworkDelay(250);
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    localStorage.setItem('glb_auth_token', `jwt-mock-token-${role}-${Date.now()}`);

    let user = mockCurrentStudent;
    if (role === 'faculty') user = mockFacultyUser;
    if (role === 'admin') user = mockAdminUser;

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async switchRole(role: UserRole): Promise<UserProfile> {
    await simulateNetworkDelay(150);
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    let user = mockCurrentStudent;
    if (role === 'faculty') user = mockFacultyUser;
    if (role === 'admin') user = mockAdminUser;
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    await simulateNetworkDelay(100);
    localStorage.removeItem('glb_auth_token');
    localStorage.setItem(ROLE_STORAGE_KEY, 'student');
  }
};
