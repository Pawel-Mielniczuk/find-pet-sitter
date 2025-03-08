import { useMutation, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import React from "react";
import { Alert } from "react-native";

import { queryClient } from "../lib/queryClient";
import { NewPet, Pet } from "../lib/schemas";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

type ErrorsType = {
  name?: string;
  type?: string;
  breed?: string;
  age?: string;
  custom_type?: string;
};

type PetsContextType = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  newPet: NewPet;
  setNewPet: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: string;
      breed: string;
      age: string;
      image: string;
      special_instructions: string | null;
      custom_type: string | null;
      weight?: string | undefined;
    }>
  >;
  typeModalVisible: boolean;
  setTypeModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  errors: ErrorsType;
  setErrors: React.Dispatch<
    React.SetStateAction<{
      name?: string;
      type?: string;
      breed?: string;
      age?: string;
      custom_type?: string;
    }>
  >;
  handleAddPet: () => Promise<void>;
  isLoading: boolean;
  pets: Pet[];
  handleDeletePet: (pet: Pet) => void;
  isDeleting: boolean;

  petForm: {
    name: string;
    type: string;
    breed: string;
    age: string;
    image: string;
    weight: string;
    special_instructions: string;
    custom_type: string;
  };
  setPetForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      type: string;
      breed: string;
      age: string;
      image: string;
      weight: string;
      special_instructions: string;
      custom_type: string;
    }>
  >;
  handleUpdatePet: (id: string) => Promise<void>;
  isUpdating: boolean;
  initializePetForm: (petData: any) => void;
  selectPetType: (type: string) => void;
};

const PetsContext = React.createContext<PetsContextType | undefined>(undefined);

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

export function PetsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  const [modalVisible, setModalVisible] = React.useState(false);
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
  const [typeModalVisible, setTypeModalVisible] = React.useState(false);

  const [petForm, setPetForm] = React.useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    image: "",
    weight: "",
    special_instructions: "",
    custom_type: "",
  });
  const [isUpdating, setIsUpdating] = React.useState(false);

  const petsQueryKey = ["pets", user?.id];
  React.useEffect(() => {
    if (newPet.type) {
      setNewPet(prev => ({
        ...prev,
        image: getPetImageByType(prev.type),
      }));
    }
  }, [newPet.type]);

  const {
    data: pets = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: petsQueryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error("Failed to load your pets");
      }

      return data || [];
    },
    enabled: !!user?.id,
  });

  const [isDeleting, setIsDeleting] = React.useState(false);
  const deletePetMutation = useMutation({
    mutationFn: async (petId: string) => {
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId)
        .eq("owner_id", user?.id);

      if (error) {
        throw new Error("Failed to delete pet");
      }
    },
    onSuccess: (_data, petId) => {
      setIsDeleting(false);
      queryClient.invalidateQueries({ queryKey: ["pets", user?.id] });

      queryClient.invalidateQueries({ queryKey: ["pet", petId] });
    },
    onError: error => {
      setIsDeleting(false);
      Alert.alert("Error", "Failed to delete pet. Please try again.");
    },
  });
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

    if (newPet.type === "Other" && !newPet.custom_type?.trim()) {
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

  const addPetMutation = useMutation({
    mutationFn: async (petData: NewPet) => {
      const { data, error } = await supabase.from("pets").insert([petData]).select();

      if (error) {
        throw new Error("Failed to add pet");
      }

      return data;
    },
    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["pets", user?.id] });

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
          params: { id: data[0].id, petData: JSON.stringify(data[0]) },
        });
      }
    },

    onError: error => {
      Alert.alert("Error", "Failed to add pet. Please try again.");
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: async ({ petData, petId }: { petData: any; petId: string }) => {
      const { error } = await supabase
        .from("pets")
        .update(petData)
        .eq("id", petId)
        .eq("owner_id", user?.id);

      if (error) {
        throw new Error(error.message);
      }
      return true;
    },
    onSuccess: (_data, variables) => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["pets", user?.id] });
      queryClient.invalidateQueries({ queryKey: ["pet", variables.petId] });

      Alert.alert("Success", "Pet updated successfully");

      router.push(`/(index)/pet/${variables.petId}`);
    },
    onError: error => {
      setIsUpdating(false);
      Alert.alert("Error", `Failed to update pet: ${error.message}`);
    },
  });

  const validateEditForm = () => {
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
  };

  async function handleUpdatePet(id: string) {
    if (!validateEditForm() || !id) return;

    setIsUpdating(true);

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
      const weightNum = parseFloat(petForm.weight);
      if (!isNaN(weightNum)) {
        petData.weight = weightNum.toString();
      } else {
        petData.weight = undefined;
      }
    } else {
      petData.weight = undefined;
    }

    updatePetMutation.mutate({ petData, petId: id });
  }

  const initializePetForm = (petData: any) => {
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
    setPetForm(prev => ({
      ...prev,
      type,
      image: getPetImageByType(type),
    }));
    setTypeModalVisible(false);
  };

  async function handleAddPet() {
    if (!validateForm()) return;

    if (!user?.id) {
      throw new Error("User ID is required");
    }

    const petData: Omit<NewPet, "owner_id"> & { owner_id: string } = {
      name: newPet.name,
      type: newPet.type === "Other" ? newPet.custom_type || "Unknown" : newPet.type,
      breed: newPet.breed,
      age: newPet.age,
      image: newPet.image,
      owner_id: user?.id,
      special_instructions: newPet.special_instructions || null,
      custom_type: newPet.type === "Other" ? newPet.custom_type : null,
      weight: newPet.weight ? newPet.weight : undefined,
    };

    if (newPet.type === "Dog" && newPet.weight) {
      petData.weight = newPet.weight;
    }

    addPetMutation.mutate(petData);
  }
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
