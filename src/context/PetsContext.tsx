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

const DOG_BREEDS: Breed[] = [
  { id: 1, name: "German Shepherd" },
  { id: 2, name: "Labrador Retriever" },
  { id: 3, name: "Golden Retriever" },
  { id: 4, name: "Dachshund" },
  { id: 5, name: "Jack Russell Terrier" },
  { id: 6, name: "Schnauzer" },
  { id: 7, name: "French Bulldog" },
  { id: 8, name: "Beagle" },
  { id: 9, name: "Border Collie" },
  { id: 10, name: "Chihuahua" },
  { id: 11, name: "Siberian Husky" },
  { id: 12, name: "Shih Tzu" },
  { id: 13, name: "Cocker Spaniel" },
  { id: 14, name: "Boxer" },
  { id: 15, name: "Bernese Mountain Dog" },
  { id: 16, name: "Yorkshire Terrier" },
  { id: 17, name: "Dalmatian" },
  { id: 18, name: "Poodle" },
  { id: 19, name: "West Highland White Terrier" },
  { id: 20, name: "Mixed Breed (Kundelek)" },
];

const CAT_BREEDS: Breed[] = [
  { id: 1, name: "British Shorthair" },
  { id: 2, name: "Maine Coon" },
  { id: 3, name: "Siberian Cat" },
  { id: 4, name: "Persian Cat" },
  { id: 5, name: "Ragdoll" },
  { id: 6, name: "Bengal Cat" },
  { id: 7, name: "Sphynx" },
  { id: 8, name: "Russian Blue" },
  { id: 9, name: "Norwegian Forest Cat" },
  { id: 10, name: "Scottish Fold" },
  { id: 11, name: "Mixed Breed (Dachowiec)" },
];

type Breed = {
  id: number;
  name: string;
};

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
    custom_type: "",
    gender: "",
    special_instructions: [],
  });

  const [petForm, setPetForm] = React.useState<PetFormData>(DEFAULT_PET_FORM);
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [selectedBreed, setSelectedBreed] = React.useState<string | null>(null);
  const [customBreeds, setCustomBreeds] = React.useState<Breed[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");

  const breeds = React.useMemo(() => {
    return newPet.type === "Dog" ? DOG_BREEDS : newPet.type === "Cat" ? CAT_BREEDS : [];
  }, [newPet.type]);

  const sortBreeds = (breeds: Breed[], selectedBreed: string | null): Breed[] => {
    if (!selectedBreed) {
      return breeds.sort((a, b) => a.name.localeCompare(b.name));
    }

    const selectedBreedItem = breeds.find(breed => breed.name === selectedBreed);
    const otherBreeds = breeds
      .filter(breed => breed.name !== selectedBreed)
      .sort((a, b) => a.name.localeCompare(b.name));

    return selectedBreedItem ? [selectedBreedItem, ...otherBreeds] : otherBreeds;
  };

  const filteredBreeds = React.useMemo(() => {
    const allBreeds = sortBreeds([...breeds, ...customBreeds], selectedBreed);
    return allBreeds.filter(breed => breed.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [breeds, customBreeds, searchQuery, selectedBreed]);

  const handleSelect = (breed: string) => {
    setSelectedBreed(breed);
    setNewPet(prev => ({ ...prev, breed }));
    setModalVisible(false);
    setSearchQuery("");
  };

  const handleAddCustomBreed = () => {
    const trimmedBreed = newPet.breed.trim();
    if (trimmedBreed !== "") {
      const newBreed = { id: Date.now(), name: trimmedBreed };
      setCustomBreeds(prevCustomBreeds => [...prevCustomBreeds, newBreed]);
      setSelectedBreed(trimmedBreed);
      setModalVisible(false);
      setSearchQuery("");
    } else {
      Alert.alert("Please enter a breed name.");
    }
  };

  React.useEffect(() => {
    if (selectedBreed && !breeds.some(breed => breed.name === selectedBreed)) {
      setCustomBreeds(prevCustomBreeds => [
        ...prevCustomBreeds,
        { id: Date.now(), name: selectedBreed },
      ]);
    }
  }, [selectedBreed]);

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
        special_instructions: [],
        custom_type: "",
        gender: "",
      });

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

      custom_type: newPet.type === "Other" ? newPet.custom_type : null,
      weight: newPet.type === PET_TYPES.Dog && newPet.weight ? newPet.weight : null,
      gender: newPet.gender,
      special_instructions: newPet.special_instructions,
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
      special_instructions: petData?.special_instructions ?? [],
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
    selectedBreed,
    filteredBreeds,
    handleSelect,
    searchQuery,
    setSearchQuery,
    handleAddCustomBreed,
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
