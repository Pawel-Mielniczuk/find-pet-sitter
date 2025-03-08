import { LegendList } from "@legendapp/list";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { Pet } from "../../lib/schemas";

type PetsListProps = {
  pets: Pet[];
};

export function PetsList({ pets }: PetsListProps) {
  function formatPetType(pet: Pet) {
    if (pet.type === "Other" && pet.custom_type) {
      return pet.custom_type;
    }
    return pet.type;
  }

  return (
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
  );
}

const styles = StyleSheet.create({
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
});
