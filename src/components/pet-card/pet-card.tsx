import { Image } from "expo-image";
import { Calendar, FileText, PawPrint, Weight } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { Pet } from "../../lib/types";

type PetCardProps = {
  pet: Pet;
};

export function PetCard({ pet }: PetCardProps) {
  return (
    <ScrollView style={styles.content}>
      <Image
        source={{ uri: pet.image }}
        style={styles.petImage}
        contentFit="cover"
        testID="image"
      />

      <View style={styles.petInfo}>
        <View style={styles.nameSection}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.typeContainer}>
            <Text style={styles.petType}>{pet.custom_type || pet.type}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <PawPrint size={20} color="#6B7280" testID="paw-print" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Breed</Text>
                <Text style={styles.infoValue}>{pet.breed}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Calendar size={20} color="#6B7280" testID="calendar" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Age</Text>
                <Text style={styles.infoValue}>{pet.age}</Text>
              </View>
            </View>
          </View>

          {pet.weight && (
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Weight size={20} color="#6B7280" testID="weight" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Weight</Text>
                  <Text style={styles.infoValue}>{pet.weight} kg</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Calendar size={20} color="#6B7280" testID="calendar-added" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Added On</Text>
                  {/* <Text style={styles.infoValue}>{formatDate(pet.created_at)}</Text> */}
                </View>
              </View>
            </View>
          )}
        </View>

        {pet.special_instructions && (
          <View style={styles.instructionsCard}>
            <View style={styles.instructionsHeader}>
              <FileText size={20} color="#6B7280" testID="file-text" />
              <Text style={styles.instructionsTitle}>Special Instructions</Text>
            </View>
            {/* <Text style={styles.instructionsText}>{pet.special_instructions}</Text> */}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  petImage: {
    width: "100%",
    height: 250,
  },
  petInfo: {
    padding: 24,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  petName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  typeContainer: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  petType: {
    color: "#7C3AED",
    fontWeight: "600",
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  infoContent: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  instructionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: "#EF4444",
    marginBottom: 16,
  },
  backButtonText: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "600",
  },
});
