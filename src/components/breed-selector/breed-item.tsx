import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { usePets } from "../../context/PetsContext";

interface BreedItemProps {
  item: { id: number; name: string };
}

export function BreedItem({ item }: BreedItemProps) {
  const { newPet, handleSelect } = usePets();
  return (
    <Pressable
      style={[
        styles.breedItem,
        newPet.breed === item.name && styles.selectedBreedItem,
        item.id === Date.now() && styles.newBreedItem,
      ]}
      onPress={() => handleSelect(item.name)}
    >
      <Text
        style={[
          styles.breedText,
          newPet.breed === item.name && styles.selectedBreedText,
          item.id === Date.now() && styles.newBreedText,
        ]}
      >
        {item.name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  breedItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  selectedBreedItem: {
    backgroundColor: "#F0FDF4",
  },
  breedText: {
    fontSize: 16,
    color: "#4B5563",
  },
  selectedBreedText: {
    color: "#047857",
    fontWeight: "500",
  },
  newBreedItem: {
    backgroundColor: "#E0F2FE",
  },
  newBreedText: {
    fontWeight: "bold",
  },
});
