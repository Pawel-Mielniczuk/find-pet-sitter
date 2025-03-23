import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Button } from "@/src/components/button/Button";

import { TextInput } from "../../../components/text-input/TextInput";
import { usePets } from "../../../context/PetsContext";

type PetBehaviour = {
  id: number;
  name: string;
};

const petBehaviorTags: PetBehaviour[] = [
  { id: 2, name: "Friendly" },
  { id: 3, name: "Anxious" },
  { id: 4, name: "Energetic" },
  { id: 5, name: "Calm" },
  { id: 6, name: "Playful" },
  { id: 9, name: "Submissive" },
  { id: 10, name: "Intelligent" },
  { id: 11, name: "Obedient" },
  { id: 12, name: "Disobedient" },
  { id: 13, name: "Territorial" },
  { id: 14, name: "Sociable" },
  { id: 15, name: "Independent" },
  { id: 16, name: "Loud" },
  { id: 17, name: "Quiet" },
  { id: 18, name: "Gentle" },
  { id: 21, name: "Easy-going" },
  { id: 22, name: "Good-natured" },
  { id: 23, name: "Well-behaved" },
];

type PetBehaviorTagsProps = {
  selectedTags: PetBehaviour[];
  onTagsChange: (selectedTagObjects: PetBehaviour[]) => void;
};

type TagPickerProps = {
  tags: PetBehaviour[];
  selectedTags: PetBehaviour[];
  onTagsChange: (selectedTagObjects: PetBehaviour[]) => void;
};

const PetBehaviorTags = ({ selectedTags, onTagsChange }: PetBehaviorTagsProps) => {
  return (
    <View>
      <Text>Select behavior tags:</Text>
      <TagPicker tags={petBehaviorTags} selectedTags={selectedTags} onTagsChange={onTagsChange} />
    </View>
  );
};

const TagPicker = ({ tags, selectedTags, onTagsChange }: TagPickerProps) => {
  const handleTagPress = (tag: PetBehaviour) => {
    let newSelectedTags: PetBehaviour[];
    if (selectedTags.some(selectedTag => selectedTag.id === tag.id)) {
      newSelectedTags = selectedTags.filter(selectedTag => selectedTag.id !== tag.id);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    onTagsChange(newSelectedTags);
  };

  return (
    <View style={styles.tagContainer}>
      {tags.map(tag => (
        <TouchableOpacity
          key={tag.id}
          style={[
            styles.chip,
            selectedTags.some(selectedTag => selectedTag.id === tag.id) && styles.selectedChip,
          ]}
          onPress={() => handleTagPress(tag)}
        >
          <Text style={styles.chipText}>{tag.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function DetailsPet() {
  const { newPet, setNewPet, errors, handleAddPet } = usePets();

  function handleTagsChange(selectedTagObjects: PetBehaviour[]) {
    setNewPet({
      ...newPet,
      special_instructions: selectedTagObjects,
    });
  }

  return (
    <ScrollView contentContainerStyle={{ alignItems: "center" }}>
      <Text style={styles.heading}>Pet's behavior</Text>
      <Text style={styles.subtitle}>Select what best describe {newPet.name}</Text>
      <PetBehaviorTags
        selectedTags={newPet.special_instructions || []}
        onTagsChange={handleTagsChange}
      />
      {/* <TextInput
        label="Anything else a sitter should now? Enter additional instructions"
        placeholder="Enter instructions for feeding or walking"
        value={newPet.special_instructions || ""}
        onChangeText={text => setNewPet({ ...newPet, special_instructions: text })}
      /> */}
      <Button onPress={handleAddPet}>Save a pet</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingBottom: 16,
    alignItems: "center",
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
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

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  selectedChip: {
    backgroundColor: "#A1D99B",
  },
  chipText: {
    fontSize: 16,
  },
});
