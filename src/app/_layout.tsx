import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <StatusBar style="auto" />
      </Stack>
    </AuthProvider>
  );
}
