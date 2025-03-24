import { ChevronRight, Search, X } from "lucide-react-native";
import React from "react";
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { usePets } from "../../context/PetsContext";
import { BreedList } from "./breed-list";

export function BreedSelector() {
  const { modalVisible, setModalVisible, newPet, searchQuery, setSearchQuery } = usePets();

  return (
    <View style={styles.container}>
      <Pressable style={styles.selector} onPress={() => setModalVisible(true)}>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Breed</Text>
        </View>
        <View style={styles.selectionContainer}>
          <Text style={newPet.breed ? styles.selectedText : styles.placeholderText}>
            {newPet.breed || `Select ${newPet.type} breed`}
          </Text>
          <ChevronRight size={20} color="#6B7280" />
        </View>
      </Pressable>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select a Breed</Text>
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <X size={24} color="#4B5563" />
              </Pressable>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search breeds..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {searchQuery !== "" && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <X size={18} color="#9CA3AF" />
                </Pressable>
              )}
            </View>

            <BreedList />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  selector: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#F9FAFB",
  },
  labelContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  selectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedText: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  placeholderText: {
    fontSize: 16,
    color: "#9CA3AF",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    height: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
});
