import { AppNotification } from '../types';
import { mockNotificationsList } from '../data/mock/mockNotifications';
import { simulateNetworkDelay } from './api';

let localNotifications = [...mockNotificationsList];

export const notificationService = {
  async getNotifications(category?: string): Promise<AppNotification[]> {
    await simulateNetworkDelay(120);
    if (!category || category === 'All') {
      return [...localNotifications];
    }
    return localNotifications.filter((n) => n.category.toLowerCase() === category.toLowerCase());
  },

  async markAsRead(id: string): Promise<AppNotification[]> {
    await simulateNetworkDelay(80);
    localNotifications = localNotifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    return [...localNotifications];
  },

  async markAllAsRead(): Promise<AppNotification[]> {
    await simulateNetworkDelay(100);
    localNotifications = localNotifications.map((n) => ({ ...n, read: true }));
    return [...localNotifications];
  }
};
