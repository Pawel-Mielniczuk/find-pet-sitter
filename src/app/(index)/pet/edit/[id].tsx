import { useMutation } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Camera, ChevronDown } from "lucide-react-native";
import React from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { queryClient } from "@/src/app/_layout";
import { Button } from "@/src/components/button/Button";
import { PetModal } from "@/src/components/pet-modal/pet-modal";
import { TextInput } from "@/src/components/text-input/TextInput";
import { NewPet } from "@/src/lib/schemas";
import { supabase } from "@/src/lib/supabase";

import { useAuth } from "../../../../context/AuthContext";

const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish", "Reptile", "Exotic", "Other"];

export default function EditPetScreen() {
  const { petData, id } = useLocalSearchParams();
  const { user } = useAuth();

  const initialPetData = petData
    ? JSON.parse(decodeURIComponent(Array.isArray(petData) ? petData[0] : petData))
    : null;
  const [typeModalVisible, setTypeModalVisible] = React.useState(false);
  const [petForm, setPetForm] = React.useState({
    name: initialPetData?.name || "",
    type: initialPetData?.custom_type ? "Other" : initialPetData?.type || "",
    breed: initialPetData?.breed || "",
    age: initialPetData?.age || "",
    image: initialPetData?.image || "",
    weight: initialPetData?.weight || "",
    special_instructions: initialPetData?.special_instructions || "",
    custom_type: initialPetData?.custom_type || "",
  });

  const [errors, setErrors] = React.useState<{
    name?: string;
    type?: string;
    breed?: string;
    age?: string;
    custom_type?: string;
  }>({});

  const updatePetMutation = useMutation({
    mutationFn: async (petData: any) => {
      const { error } = await supabase
        .from("pets")
        .update(petData)
        .eq("id", id)
        .eq("owner_id", user?.id);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pets"] });
      queryClient.invalidateQueries({ queryKey: ["pet", id] });

      Alert.alert("Success", "Pet updated successfully");

      router.push(`/(index)/pet/${id}`);
    },
    onError: error => {
      Alert.alert("Error", `Failed to update pet: ${error.message}`);
    },
  });

  function validateForm() {
    const newErrors: {
      name?: string;
      type?: string;
      breed?: string;
      age?: string;
      custom_type?: string;
    } = {};

    if (!petForm.name.trim()) {
      newErrors.name = "Pet name is required";
    }

    if (!petForm.type) {
      newErrors.type = "Pet type is required";
    }

    if (petForm.type === "Other" && !petForm.custom_type.trim()) {
      newErrors.custom_type = "Please specify your pet type";
    }

    if (!petForm.breed.trim()) {
      newErrors.breed = "Breed is required";
    }

    if (!petForm.age.trim()) {
      newErrors.age = "Age is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validateForm() || !id) return;

    const petData: NewPet = {
      name: petForm.name,
      type: petForm.type === "Other" ? petForm.type : petForm.type,
      breed: petForm.breed,
      age: petForm.age,
      image: petForm.image,
      special_instructions: petForm.special_instructions || null,
      custom_type: petForm.type === "Other" ? petForm.custom_type : null,
    };

    if (petForm.type === "Dog" && petForm.weight) {
      petData.weight = petForm.weight;
    } else {
      petData.weight = "";
    }

    updatePetMutation.mutate(petData);
  }
  const selectPetType = (type: string) => {
    setPetForm({ ...petForm, type });
    setTypeModalVisible(false);

    if (type !== petForm.type) {
      setPetForm(prev => ({
        ...prev,
        type,
        image: getPetImageByType(type),
      }));
    }
  };

  const getPetImageByType = (type: string) => {
    const images = {
      Dog: "https://images.unsplash.com/photo-1552053831-71594a27632d",
      Cat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      Bird: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f",
      Rabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308",
      Hamster: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca",
      Fish: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5",
      Reptile: "https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae",
      Exotic: "https://images.unsplash.com/photo-1515536765-9b2a70c4b333",
      Other: "https://images.unsplash.com/photo-1543466835-00a7907e9de1",
    };

    return images[type as keyof typeof images] || images["Other"];
  };

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
              onPress={handleSave}
              loading={updatePetMutation.isPending}
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

      <PetModal
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
