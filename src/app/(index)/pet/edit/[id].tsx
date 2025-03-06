import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function EditPetScreen() {
  const { petData } = useLocalSearchParams();
  const pet = petData
    ? JSON.parse(decodeURIComponent(Array.isArray(petData) ? petData[0] : petData))
    : null;

  return (
    <View>
      <Text>hello pet to edit {pet.name}</Text>
    </View>
  );
}
