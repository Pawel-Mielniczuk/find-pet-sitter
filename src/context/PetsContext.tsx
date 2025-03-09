import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import { validatePetData } from "../formValidations/validatePetData";
import { addPet, deletePet, fetchPets, updatePet } from "../lib/api";
import { DEFAULT_PET_FORM, DEFAULT_PET_IMAGE, PET_IMAGES } from "../lib/constants";
import { queryClient } from "../lib/queryClient";
import {
  AddPetVariables,
  NewPet,
  Pet,
  PET_TYPES,
  PetFormData,
  PetsContextType,
  ValidationErrors,
} from "../lib/types";
import { useAuth } from "./AuthContext";

const getPetImageByType = (type: string): string => {
  return PET_IMAGES[type as keyof typeof PET_IMAGES] || PET_IMAGES.Other;
};

const PetsContext = React.createContext<PetsContextType | undefined>(undefined);
export function PetsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = React.useState(false);
  const [typeModalVisible, setTypeModalVisible] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const [newPet, setNewPet] = React.useState<NewPet>({
    name: "",
    type: "",
    breed: "",
    age: "",
    image: DEFAULT_PET_IMAGE,
    weight: null,
    special_instructions: "",
    custom_type: "",
  });

  const [petForm, setPetForm] = React.useState<PetFormData>(DEFAULT_PET_FORM);
  const [errors, setErrors] = React.useState<ValidationErrors>({});

  React.useEffect(() => {
    if (newPet.type) {
      setNewPet(prev => ({
        ...prev,
        image: getPetImageByType(prev.type),
      }));
    }
  }, [newPet.type]);

  const petsQueryKey = ["pets", user?.id];
  const { data: pets = [], isLoading } = useQuery({
    queryKey: petsQueryKey,
    queryFn: () => fetchPets(user?.id || ""),
    enabled: !!user?.id,
  });

  const addPetMutation = useMutation({
    mutationFn: addPet,
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["pets", user?.id] });
      setNewPet({
        name: "",
        type: "",
        breed: "",
        age: "",
        image: DEFAULT_PET_IMAGE,
        weight: null,
        special_instructions: "",
        custom_type: "",
      });
      setModalVisible(false);

      if (data && data.length > 0) {
        router.push({
          pathname: "/pet/[id]",
          params: { id: data[0].id, petData: JSON.stringify(data[0]) },
        });
      }
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to add pet. Please try again.");
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: (variables: { petData: Partial<NewPet>; petId: string }) =>
      updatePet(variables, user?.id || ""),
    onSuccess: (_data, variables) => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["pets", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId] });

      Alert.alert("Success", "Pet updated successfully");
      router.push(`/(index)/pet/${variables.petId}`);
    },
    onError: (error: Error) => {
      setIsUpdating(false);
      Alert.alert("Error", error.message || "Failed to update pet");
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: (petId: string) => deletePet(petId, user?.id || ""),
    onSuccess: (_data, petId) => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["pets", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["pet", petId] });
    },
    onError: (error: Error) => {
      setIsDeleting(false);
      Alert.alert("Error", error.message || "Failed to delete pet. Please try again.");
    },
  });

  const handleAddPet = async () => {
    const newErrors = validatePetData(newPet);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (!user?.id) {
      throw new Error("User ID is required");
    }

    const petData: AddPetVariables = {
      name: newPet.name,
      type: newPet.type === "Other" ? newPet.custom_type || "Unknown" : newPet.type,
      breed: newPet.breed,
      age: newPet.age,
      image: newPet.image,
      owner_id: user.id,
      special_instructions: newPet.special_instructions || null,
      custom_type: newPet.type === "Other" ? newPet.custom_type : null,
      weight: newPet.type === PET_TYPES.Dog && newPet.weight ? newPet.weight : null,
    };

    addPetMutation.mutate(petData);
  };

  const handleUpdatePet = async (id: string) => {
    const newErrors = validatePetData(petForm);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0 || !id) return;

    setIsUpdating(true);

    const petData: Partial<NewPet> = {
      name: petForm.name,
      type: petForm.type === "Other" ? petForm.type : petForm.type,
      breed: petForm.breed,
      age: petForm.age,
      image: petForm.image,
      special_instructions: petForm.special_instructions || null,
      custom_type: petForm.type === "Other" ? petForm.custom_type : null,
    };

    if (petForm.type === PET_TYPES.Dog) {
      const weightNum = parseFloat(petForm.weight);
      petData.weight = !isNaN(weightNum) && weightNum > 0 ? weightNum : null;
    } else {
      petData.weight = null;
    }

    updatePetMutation.mutate({ petData, petId: id });
  };

  const handleDeletePet = (pet: Pet) => {
    Alert.alert("Delete Pet", `Are you sure you want to delete ${pet.name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setIsDeleting(true);
          deletePetMutation.mutate(pet.id, {
            onSuccess: () => {
              Alert.alert("Success", `${pet.name} has been deleted.`);
              router.replace("/(index)/pets");
            },
          });
        },
      },
    ]);
  };

  const initializePetForm = (petData: Partial<Pet>) => {
    setPetForm({
      name: petData?.name || "",
      type: petData?.custom_type ? "Other" : petData?.type || "",
      breed: petData?.breed || "",
      age: petData?.age || "",
      image: petData?.image || "",
      weight: petData?.weight || "",
      special_instructions: petData?.special_instructions || "",
      custom_type: petData?.custom_type || "",
    });
  };

  const selectPetType = (type: string) => {
    setPetForm((prev: PetFormData) => ({
      ...prev,
      type,
      image: getPetImageByType(type),
    }));
    setTypeModalVisible(false);
  };
  const values = {
    modalVisible,
    setModalVisible,
    newPet,
    setNewPet,
    typeModalVisible,
    setTypeModalVisible,
    errors,
    setErrors,
    handleAddPet,
    pets,
    isLoading,
    handleDeletePet,
    isDeleting,
    petForm,
    setPetForm,
    handleUpdatePet,
    isUpdating,
    initializePetForm,
    selectPetType,
  };
  return <PetsContext.Provider value={values}>{children}</PetsContext.Provider>;
}

export function usePets() {
  const context = React.useContext(PetsContext);
  if (context === undefined) {
    throw new Error("usePets must be used within an PetsProvider");
  }
  return context;
}
