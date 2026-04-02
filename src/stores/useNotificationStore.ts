import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AdminNotification {
  id: string;
  applicationId: string;
  message: string;
  sentAt: number;
  read: boolean;
}

interface NotificationState {
  notifications: AdminNotification[];
  addNotification: (applicationId: string, message: string) => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      addNotification: (applicationId, message) =>
        set((state) => ({
          notifications: [
            {
              id: `${applicationId}-${Date.now()}`,
              applicationId,
              message,
              sentAt: Date.now(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        })),
      clearAll: () => set({ notifications: [] }),
    }),
    { name: 'admin-notifications' },
  ),
);
