import { LegendList } from "@legendapp/list";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { usePets } from "../../context/PetsContext";
import { BreedItem } from "./breed-item";
import { CustomBreedInput } from "./custom-breed-input";

export function BreedList() {
  const { filteredBreeds } = usePets();

  return (
    <View style={styles.container}>
      <LegendList
        data={filteredBreeds}
        estimatedItemSize={50}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <BreedItem item={item} />}
        style={styles.list}
      />
      {filteredBreeds.length === 0 && (
        <View style={styles.noResults}>
          <Text style={styles.noResultsText}>No results found</Text>
          <CustomBreedInput />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  noResults: {
    alignItems: "center",
    marginTop: 24,
  },
  noResultsText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
