import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login-form" />
      <Stack.Screen name="register-form" />
      <Stack.Screen name="complete-profile" />
    </Stack>
  );
}
