import { Plus } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { usePets } from "../../context/PetsContext";

export function CustomBreedInput() {
  const { newPet, setNewPet, handleAddCustomBreed } = usePets();
  const customBreed = newPet.breed;

  return (
    <View>
      <Text style={styles.customBreedLabel}>Enter a custom breed:</Text>
      <TextInput
        style={styles.customBreedInput}
        placeholder="Custom breed"
        value={customBreed}
        onChangeText={text => setNewPet(prev => ({ ...prev, breed: text }))}
        autoCapitalize="words"
        onSubmitEditing={handleAddCustomBreed}
      />
      <Pressable style={styles.addCustomBreedButton} onPress={handleAddCustomBreed}>
        <Plus size={20} color="#FFFFFF" />
        <Text style={styles.addCustomBreedButtonText}>Add "{customBreed}" as a breed</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  customBreedLabel: {
    fontSize: 16,
    color: "#4B5563",
    marginTop: 16,
    marginBottom: 8,
  },
  customBreedInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
    width: 200,
  },
  addCustomBreedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 24,
    backgroundColor: "#4F46E5",
    borderRadius: 8,
  },
  addCustomBreedButtonText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginLeft: 8,
    fontWeight: "600",
  },
});
