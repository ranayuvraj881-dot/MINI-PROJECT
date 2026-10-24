import { AppNotification } from '../types';
import { apiClient } from './api';

export const notificationService = {
  /**
   * Retrieves notifications with optional category filtering from the backend.
   */
  async getNotifications(category?: string): Promise<AppNotification[]> {
    const query = category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : '';
    return await apiClient<AppNotification[]>(`/notifications${query}`);
  },

  /**
   * Marks a specific notification as read in the database.
   */
  async markAsRead(id: string): Promise<AppNotification[]> {
    return await apiClient<AppNotification[]>(`/notifications/${encodeURIComponent(id)}/read`, {
      method: 'POST',
    });
  },

  /**
   * Marks all notifications for the authenticated student as read in the database.
   */
  async markAllAsRead(): Promise<AppNotification[]> {
    return await apiClient<AppNotification[]>('/notifications/read-all', {
      method: 'POST',
    });
  }
};
