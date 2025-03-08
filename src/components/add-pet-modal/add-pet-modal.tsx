import { Image } from "expo-image";
import { Camera, ChevronDown, X } from "lucide-react-native";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { TextInput } from "../../components/text-input/TextInput";
import { usePets } from "../../context/PetsContext";
import { Button } from "../button/Button";

export function AddPetModal() {
  const {
    modalVisible,
    setModalVisible,
    newPet,
    setNewPet,
    setTypeModalVisible,
    errors,
    handleAddPet,
    isLoading,
  } = usePets();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add a New Pet</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: newPet.image }} style={styles.petImagePreview} />
              <TouchableOpacity style={styles.cameraButton}>
                <Camera size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TextInput
              label="Pet Name"
              placeholder="Enter your pet's name"
              value={newPet.name}
              onChangeText={text => setNewPet({ ...newPet, name: text })}
              error={errors.name}
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Pet Type</Text>
              <TouchableOpacity
                style={[styles.dropdown, errors.type ? styles.inputError : null]}
                onPress={() => setTypeModalVisible(true)}
              >
                <Text style={newPet.type ? styles.dropdownText : styles.placeholderText}>
                  {newPet.type || "Select pet type"}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
              {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
            </View>

            {newPet.type === "Other" && (
              <TextInput
                label="Specify Pet Type"
                placeholder="E.g., Ferret, Mantis, Hedgehog"
                value={newPet.custom_type ?? ""}
                onChangeText={text => setNewPet({ ...newPet, custom_type: text })}
                error={errors.custom_type}
              />
            )}

            <TextInput
              label="Breed"
              placeholder="Enter your pet's breed"
              value={newPet.breed}
              onChangeText={text => setNewPet({ ...newPet, breed: text })}
              error={errors.breed}
            />

            <TextInput
              label="Age"
              placeholder="Enter your pet's age (e.g., 2 years)"
              value={newPet.age}
              onChangeText={text => setNewPet({ ...newPet, age: text })}
              error={errors.age}
              keyboardType="number-pad"
              maxLength={2}
            />

            {newPet.type === "Dog" && (
              <TextInput
                label="Weight (kg)"
                placeholder="Enter your dog's weight"
                keyboardType="numeric"
                value={newPet.weight}
                onChangeText={text => setNewPet({ ...newPet, weight: text })}
                maxLength={2}
              />
            )}

            <TextInput
              label="Special Instructions (Optional)"
              placeholder="Any special care instructions for your pet"
              value={newPet.special_instructions ?? ""}
              onChangeText={text => setNewPet({ ...newPet, special_instructions: text })}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
              containerStyle={styles.textAreaContainer}
              style={styles.textArea}
            />

            <Button onPress={handleAddPet} loading={isLoading} style={styles.addPetButton}>
              Add Pet
            </Button>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  petImagePreview: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#7C3AED",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  addPetButton: {
    marginTop: 24,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    color: "#111827",
  },
  placeholderText: {
    fontSize: 16,
    color: "#9CA3AF",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 4,
  },

  textAreaContainer: {
    height: 100,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
});
