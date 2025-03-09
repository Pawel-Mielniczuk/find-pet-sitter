import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Camera, ChevronDown } from "lucide-react-native";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/src/components/button/Button";
import { PetTypeModal } from "@/src/components/pet-type-modal/pet-type-modal";
import { TextInput } from "@/src/components/text-input/TextInput";
import { usePets } from "@/src/context/PetsContext";
import { PET_TYPES } from "@/src/lib/types";

export default function EditPetScreen() {
  const { petData, id } = useLocalSearchParams();

  const {
    petForm,
    setPetForm,
    typeModalVisible,
    setTypeModalVisible,
    errors,
    handleUpdatePet,
    isUpdating,
    initializePetForm,
    selectPetType,
  } = usePets();

  React.useEffect(() => {
    const initialPetData = petData
      ? JSON.parse(decodeURIComponent(Array.isArray(petData) ? petData[0] : petData))
      : null;

    if (initialPetData) {
      initializePetForm(initialPetData);
    }
  }, [petData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Pet</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: petForm.image }} style={styles.petImagePreview} />
          <TouchableOpacity style={styles.cameraButton}>
            <Camera size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Pet Name"
            placeholder="Enter your pet's name"
            value={petForm.name}
            onChangeText={text => setPetForm({ ...petForm, name: text })}
            error={errors.name}
          />

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Pet Type</Text>
            <TouchableOpacity
              style={[styles.dropdown, errors.type ? styles.inputError : null]}
              onPress={() => setTypeModalVisible(true)}
            >
              <Text style={petForm.type ? styles.dropdownText : styles.placeholderText}>
                {petForm.type || "Select pet type"}
              </Text>
              <ChevronDown size={20} color="#6B7280" />
            </TouchableOpacity>
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          </View>

          {petForm.type === "Other" && (
            <TextInput
              label="Specify Pet Type"
              placeholder="E.g., Ferret, Mantis, Hedgehog"
              value={petForm.custom_type}
              onChangeText={text => setPetForm({ ...petForm, custom_type: text })}
              error={errors.custom_type}
            />
          )}

          <TextInput
            label="Breed"
            placeholder="Enter your pet's breed"
            value={petForm.breed}
            onChangeText={text => setPetForm({ ...petForm, breed: text })}
            error={errors.breed}
          />

          <TextInput
            label="Age"
            placeholder="Enter your pet's age (e.g., 2 years)"
            value={petForm.age}
            keyboardType="number-pad"
            maxLength={2}
            onChangeText={text => setPetForm({ ...petForm, age: text })}
            error={errors.age}
          />

          {petForm.type === "Dog" && (
            <TextInput
              label="Weight (kg)"
              placeholder="Enter your dog's weight"
              keyboardType="numeric"
              value={petForm.weight}
              onChangeText={text => setPetForm({ ...petForm, weight: text })}
            />
          )}

          <TextInput
            label="Special Instructions (Optional)"
            placeholder="Any special care instructions for your pet"
            value={petForm.special_instructions}
            onChangeText={text => setPetForm({ ...petForm, special_instructions: text })}
            multiline={true}
            numberOfLines={3}
            textAlignVertical="top"
            containerStyle={styles.textAreaContainer}
            style={styles.textArea}
          />

          <View style={styles.buttonContainer}>
            <Button
              onPress={() => handleUpdatePet(id as string)}
              loading={isUpdating}
              style={styles.saveButton}
            >
              Save Changes
            </Button>
            <Button onPress={() => router.back()} variant="outline" style={styles.cancelButton}>
              Cancel
            </Button>
          </View>
        </View>
      </ScrollView>

      <PetTypeModal
        visible={typeModalVisible}
        onClose={() => setTypeModalVisible(false)}
        onSelectType={selectPetType}
        petTypes={Object.values(PET_TYPES)}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  content: {
    flex: 1,
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
  form: {
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
  buttonContainer: {
    marginTop: 24,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
});
