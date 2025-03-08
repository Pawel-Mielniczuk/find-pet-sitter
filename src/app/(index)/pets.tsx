import { PawPrint, Plus } from "lucide-react-native";
import React from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { AddPetModal } from "@/src/components/add-pet-modal/add-pet-modal";
import { PetsList } from "@/src/components/pets-list/pets-list";
import { usePets } from "@/src/context/PetsContext";

import { Button } from "../../components/button/Button";
import { PetTypeModal } from "../../components/pet-type-modal/pet-type-modal";

const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish", "Reptile", "Exotic", "Other"];

export default function PetsScreen() {
  const {
    setModalVisible,
    setTypeModalVisible,
    setNewPet,
    newPet,
    pets,
    isLoading,
    typeModalVisible,
  } = usePets();

  const selectPetType = (type: string) => {
    setNewPet({ ...newPet, type });
    setTypeModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pets</Text>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading your pets...</Text>
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <PawPrint size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No pets yet</Text>
          <Text style={styles.emptyText}>Add your first pet by tapping the + button</Text>
          <Button onPress={() => setModalVisible(true)} style={styles.emptyButton}>
            Add a Pet
          </Button>
        </View>
      ) : (
        <PetsList pets={pets} />
      )}

      <AddPetModal />

      <PetTypeModal
        visible={typeModalVisible}
        onClose={() => setTypeModalVisible(false)}
        onSelectType={selectPetType}
        petTypes={PET_TYPES}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  addButton: {
    backgroundColor: "#7C3AED",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    width: "100%",
    maxWidth: 250,
  },
  textAreaContainer: {
    height: 100,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
});
