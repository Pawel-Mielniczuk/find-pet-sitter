import { LegendList } from "@legendapp/list";
import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import { Camera, ChevronDown, PawPrint, Plus, X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { NewPet, Pet } from "@/src/lib/schemas";

import { Button } from "../../components/button/Button";
import { PetModal } from "../../components/pet-modal/pet-modal";
import { TextInput } from "../../components/text-input/TextInput";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

const PET_TYPES = ["Dog", "Cat", "Bird", "Rabbit", "Hamster", "Fish", "Reptile", "Exotic", "Other"];

export default function PetsScreen() {
  const { user } = useAuth();
  const [pets, setPets] = React.useState<Pet[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [typeModalVisible, setTypeModalVisible] = React.useState(false);
  const [newPet, setNewPet] = React.useState<NewPet>({
    name: "",
    type: "",
    breed: "",
    age: "",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    weight: "",
    special_instructions: "",
    custom_type: "",
  });
  const [errors, setErrors] = React.useState<{
    name?: string;
    type?: string;
    breed?: string;
    age?: string;
    custom_type?: string;
  }>({});
  const [addingPet, setAddingPet] = React.useState(false);
  const params = useLocalSearchParams();

  React.useEffect(() => {
    if (user) {
      fetchPets();
    }
  }, [user]);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        Alert.alert("Error", "Failed to load your pets. Please try again.");
      } else {
        setPets(data || []);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load your pets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: {
      name?: string;
      type?: string;
      breed?: string;
      age?: string;
      custom_type?: string;
    } = {};

    if (!newPet.name.trim()) {
      newErrors.name = "Pet name is required";
    }

    if (!newPet.type) {
      newErrors.type = "Pet type is required";
    }

    if (newPet.type === "Other" && !newPet.custom_type.trim()) {
      newErrors.custom_type = "Please specify your pet type";
    }

    if (!newPet.breed.trim()) {
      newErrors.breed = "Breed is required";
    }

    if (!newPet.age.trim()) {
      newErrors.age = "Age is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPet = async () => {
    if (!validateForm()) return;

    try {
      setAddingPet(true);

      const petData: Partial<Pet> = {
        name: newPet.name,
        type: newPet.type === "Other" ? newPet.custom_type : newPet.type,
        breed: newPet.breed,
        age: newPet.age,
        image: newPet.image,
        owner_id: user?.id,
        special_instructions: newPet.special_instructions || null,
        custom_type: newPet.type === "Other" ? newPet.custom_type : null,
      };

      if (newPet.type === "Dog" && newPet.weight) {
        petData.weight = newPet.weight;
      }

      const { data, error } = await supabase.from("pets").insert([petData]).select();

      if (error) {
        Alert.alert("Error", "Failed to add pet. Please try again.");
      } else {
        setNewPet({
          name: "",
          type: "",
          breed: "",
          age: "",
          image:
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          weight: "",
          special_instructions: "",
          custom_type: "",
        });
        setModalVisible(false);

        if (data && data.length > 0) {
          router.push({
            pathname: "/pet/[id]",
            params: { id: data[0].id },
          });
        } else {
          fetchPets();
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add pet. Please try again.");
    } finally {
      setAddingPet(false);
    }
  };

  const selectPetType = (type: string) => {
    setNewPet({ ...newPet, type });
    setTypeModalVisible(false);
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

  React.useEffect(() => {
    if (newPet.type) {
      setNewPet(prev => ({
        ...prev,
        image: getPetImageByType(prev.type),
      }));
    }
  }, [newPet.type]);

  const formatPetType = (pet: Pet) => {
    if (pet.type === "Other" && pet.custom_type) {
      return pet.custom_type;
    }
    return pet.type;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pets</Text>
        <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Plus size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      {loading ? (
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
        <LegendList
          data={pets}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item: pet }) => (
            <Link
              style={styles.petCard}
              href={{
                pathname: "/(index)/pet/[id]",
                params: {
                  id: pet.id,
                  petData: JSON.stringify(pet),
                },
              }}
            >
              <Image source={{ uri: pet.image }} style={styles.petImage} />
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{pet.name}</Text>
                <Text style={styles.petBreed}>{pet.breed}</Text>
                <View style={styles.petDetails}>
                  <Text style={styles.petType}>{formatPetType(pet)}</Text>
                  <Text style={styles.petAge}>{pet.age}</Text>
                </View>
                {pet.weight && <Text style={styles.petWeight}>Weight: {pet.weight}</Text>}
                {pet.special_instructions && (
                  <Text style={styles.specialInstructions} numberOfLines={2}>
                    Note: {pet.special_instructions}
                  </Text>
                )}
              </View>
            </Link>
          )}
          contentContainerStyle={styles.petList}
          estimatedItemSize={50}
        />
      )}

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
                  value={newPet.custom_type}
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
              />

              {newPet.type === "Dog" && (
                <TextInput
                  label="Weight (kg)"
                  placeholder="Enter your dog's weight"
                  keyboardType="numeric"
                  value={newPet.weight}
                  onChangeText={text => setNewPet({ ...newPet, weight: text })}
                />
              )}

              <TextInput
                label="Special Instructions (Optional)"
                placeholder="Any special care instructions for your pet"
                value={newPet.special_instructions}
                onChangeText={text => setNewPet({ ...newPet, special_instructions: text })}
                multiline={true}
                numberOfLines={3}
                textAlignVertical="top"
                containerStyle={styles.textAreaContainer}
                style={styles.textArea}
              />

              <Button onPress={handleAddPet} loading={addingPet} style={styles.addPetButton}>
                Add Pet
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
  petList: {
    padding: 24,
  },
  petCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  petImage: {
    width: 120,
    height: 120,
  },
  petInfo: {
    flex: 1,
    padding: 16,
  },
  petName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  petBreed: {
    fontSize: 16,
    color: "#4B5563",
    marginBottom: 8,
  },
  petDetails: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  petType: {
    fontSize: 14,
    color: "#7C3AED",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  petAge: {
    fontSize: 14,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  petWeight: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
  specialInstructions: {
    fontSize: 14,
    color: "#4B5563",
    fontStyle: "italic",
  },
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
