"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export interface AppNotification {
  id: string | number;
  type: "success" | "error" | "warn" | "info";
  title?: string;
  titleKey?: string;
  body?: string;
  bodyKey?: string;
  bodyVars?: Record<string, string | number>;
  time?: string;
  timeKey?: string;
  read: boolean;
}

export type NewNotification = Omit<AppNotification, "id" | "read"> & { id?: string | number };

interface NotificationsContextValue {
  notifications: AppNotification[];
  addNotification: (notification: NewNotification) => void;
  markAllRead: () => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const addNotification = useCallback((notification: NewNotification) => {
    setNotifications((current) => [
      {
        ...notification,
        id: notification.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        read: false,
      },
      ...current,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }, []);

  const value = useMemo(
    () => ({ notifications, addNotification, markAllRead }),
    [notifications, addNotification, markAllRead],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }
  return ctx;
}
