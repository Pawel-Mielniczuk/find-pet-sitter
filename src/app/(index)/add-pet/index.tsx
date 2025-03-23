import { Link, router } from "expo-router";
import { Cat, Dog, Mars, Plus, Turtle, Venus } from "lucide-react-native";
import React, { ReactNode } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Button } from "../../../components/button/Button";
import { ImageInput } from "../../../components/image-input/image-input";
import { TextInput } from "../../../components/text-input/TextInput";
import { usePets } from "../../../context/PetsContext";

const pet_types = ["Dog", "Cat", "Other"];
const pet_genders = ["Male", "Female"];

function renderIcons(type: string, isSelected: boolean): ReactNode {
  switch (true) {
    case type === "Dog":
      return <Dog size={45} color={isSelected ? "#A1D99B" : "#6B7280"} />;
    case type === "Cat":
      return <Cat size={45} color={isSelected ? "#A1D99B" : "#6B7280"} />;
    case type === "Other":
      return <Turtle size={45} color={isSelected ? "#A1D99B" : "#6B7280"} />;
  }
}

function renderGenderIcons(gender: string, isSelected: boolean): ReactNode {
  switch (true) {
    case gender === "Male":
      return <Mars size={45} color={isSelected ? "#A1D99B" : "#6B7280"} />;
    case gender === "Female":
      return <Venus size={45} color={isSelected ? "#A1D99B" : "#6B7280"} />;
  }
}

export default function AddPet() {
  const { newPet, setNewPet, errors } = usePets();

  function handleSelectType(pet: string) {
    setNewPet({ ...newPet, type: pet });
  }

  function handleSelectGender(gender: string) {
    setNewPet({ ...newPet, gender });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.heading}>Tell us about the pet</Text>
        <Text style={styles.subtitle}>What type of pet?</Text>
        <View style={styles.selectPetContainer}>
          {pet_types.map(pet => {
            const isSelected = newPet.type === pet;
            return (
              <Pressable
                key={pet}
                style={[
                  styles.petType,
                  isSelected ? styles.selectedPetType : styles.unselectedPetType,
                ]}
                onPress={() => handleSelectType(pet)}
              >
                {renderIcons(pet, isSelected)}
                <Text>{pet}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text style={[styles.subtitle, { marginTop: 24, textAlign: "center" }]}>Pet gender</Text>
      <View style={styles.selectGenderContainer}>
        {pet_genders.map(gender => {
          const isSelected = newPet.gender === gender;
          return (
            <Pressable
              key={gender}
              style={[
                styles.genderType,
                isSelected ? styles.selectedPetType : styles.unselectedPetType,
              ]}
              onPress={() => handleSelectGender(gender)}
            >
              {renderGenderIcons(gender, isSelected)}
              <Text style={{ marginTop: 8, color: isSelected ? "#4B5563" : "#6B7280" }}>
                {gender}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <View style={styles.separator} />

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        <ImageInput />
        <TextInput
          label="Pet Name"
          placeholder="Enter your pet's name"
          value={newPet.name}
          onChangeText={text => setNewPet({ ...newPet, name: text })}
          error={errors.name}
        />

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
      </View>

      <Button onPress={() => router.push("/(index)/add-pet/details")}>Next</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 32,
    marginVertical: 32,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
  },

  selectPetContainer: {
    flexDirection: "row",
    gap: 16,
    marginTop: 16,
  },
  separator: {
    width: Dimensions.get("window").width,
    height: 10,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },

  addButton: {
    backgroundColor: "#7C3AED",
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },

  petType: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  selectedPetType: {
    borderWidth: 2,
    borderColor: "#A1D99B",
  },
  unselectedPetType: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  selectGenderContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginTop: 16,
  },
  genderType: {
    width: 80,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
