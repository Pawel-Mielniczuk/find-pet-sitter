import { Stack, usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ProgressIndicator } from "../../../components/progress-indicator/progress-indicator";

export default function Layout() {
  const pathname = usePathname();
  const currentStep = pathname.includes("/details") ? 2 : 1;
  return (
    <View style={styles.container}>
      <ProgressIndicator currentStep={currentStep} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="details" />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
  },
});
