import { EventSubscription } from "expo-modules-core";
import * as Notifications from "expo-notifications";
import React, { ReactNode } from "react";

import { registerForPushNotificationsAsync } from "../lib/registerPushNotificationsAsync";
import { useAuth } from "./AuthContext";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = React.createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = React.useState<string | null>(null);
  const [notification, setNotification] = React.useState<Notifications.Notification | null>(null);
  const [error, setError] = React.useState<Error | null>(null);
  const { user } = useAuth();

  const notificationListener = React.useRef<EventSubscription>();
  const responseListener = React.useRef<EventSubscription>();

  React.useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync(user.id).then(
        token => setExpoPushToken(token),
        error => setError(error),
      );
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {},
    );

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{ expoPushToken, notification, error }}>
      {children}
    </NotificationContext.Provider>
  );
};
