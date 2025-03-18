import { QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Slot, SplashScreen } from "expo-router";
import React from "react";

import { AuthProvider } from "../context/AuthContext";
import { NotificationProvider } from "../context/NotificationsContext";
import { PetsProvider } from "../context/PetsContext";
import { SearchProvider } from "../context/SearchContext";
import { queryClient } from "../lib/queryClient";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
          <PetsProvider>
            <SearchProvider>
              <Slot />
            </SearchProvider>
          </PetsProvider>
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
