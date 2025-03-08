import { QueryClientProvider } from "@tanstack/react-query";
import { Slot } from "expo-router";
import React from "react";

import { AuthProvider } from "../context/AuthContext";
import { PetsProvider } from "../context/PetsContext";
import { queryClient } from "../lib/queryClient";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PetsProvider>
          <Slot />
        </PetsProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
