import { router, Stack } from "expo-router";
import React from "react";

import { useAuth } from "@/src/context/AuthContext";

export default function AuthLayout() {
  const { user } = useAuth();
  React.useEffect(() => {
    if (user && user.user_role === "pet_sitter") {
      router.replace("/(auth)/pet-sitter-profile-form");
    }
  }, [user]);
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login-form" />
      <Stack.Screen name="register-form" />
      <Stack.Screen name="complete-profile" />
      <Stack.Screen name="pet-sitter-profile-form" />
    </Stack>
  );
}
