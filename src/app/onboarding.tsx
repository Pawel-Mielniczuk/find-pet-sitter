import { router } from "expo-router";
import { Text, View } from "react-native";

import { useAuth } from "../context/AuthContext";

export default function OnBoardingScreen() {
  const { user } = useAuth();

  if (user) {
    router.replace("/(tabs)");
    return null;
  }

  return (
    <View>
      <Text>Onboarding Screen</Text>
    </View>
  );
}
