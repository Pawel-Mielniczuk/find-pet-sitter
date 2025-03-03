import { Text, View } from "react-native";

import { useAuth } from "@/src/context/AuthContext";

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Home</Text>
    </View>
  );
}
