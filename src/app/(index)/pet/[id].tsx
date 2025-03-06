import { Image } from "expo-image";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  FileText,
  PawPrint,
  Pencil,
  Trash2,
  Weight,
} from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Pet } from "@/src/lib/schemas";

import { useAuth } from "../../../context/AuthContext";
import { supabase } from "../../../lib/supabase";

export default function PetDetailsScreen() {
  const { petData, id } = useLocalSearchParams();
  const { loading: authLoading, user } = useAuth();
  // const pet = petData ? JSON.parse(decodeURIComponent(petData)) : null;
  const pet = petData
    ? JSON.parse(decodeURIComponent(Array.isArray(petData) ? petData[0] : petData))
    : null;
  // const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [deleting, setDeleting] = React.useState(false);

  if (authLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Loading pet details...</Text>
      </View>
    );
  }

  async function handleDeletePet() {
    Alert.alert("Delete Pet", `Are you sure you want to delete ${pet?.name}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: deletePet,
      },
    ]);
  }

  const deletePet = async () => {
    if (!pet) return;

    try {
      setDeleting(true);
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", pet.id)
        .eq("owner_id", user?.id);

      if (error) {
        Alert.alert("Error", "Failed to delete pet. Please try again.");
      } else {
        Alert.alert("Success", `${pet.name} has been deleted.`);
        router.replace("/(index)/pets");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to delete pet. Please try again.");
    } finally {
      setDeleting(false);
    }
  };
  function formatDate() {}

  if (!pet) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pet not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/pets")}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pet.name}</Text>
        <View style={styles.headerActions}>
          <Link
            style={styles.actionButton}
            href={{
              pathname: "/pet/edit/[id]",
              params: { petData: JSON.stringify(pet), id: pet.id },
            }}
          >
            <Pencil size={24} color="#6B7280" />
          </Link>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDeletePet}
            disabled={deleting}
          >
            {deleting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <Trash2 size={24} color="#EF4444" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content}>
        <Image source={{ uri: pet.image }} style={styles.petImage} contentFit="cover" />

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
                <PawPrint size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Breed</Text>
                  <Text style={styles.infoValue}>{pet.breed}</Text>
                </View>
              </View>
              <View style={styles.infoItem}>
                <Calendar size={20} color="#6B7280" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Age</Text>
                  <Text style={styles.infoValue}>{pet.age}</Text>
                </View>
              </View>
            </View>

            {pet.weight && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Weight size={20} color="#6B7280" />
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Weight</Text>
                    <Text style={styles.infoValue}>{pet.weight} kg</Text>
                  </View>
                </View>
                <View style={styles.infoItem}>
                  <Calendar size={20} color="#6B7280" />
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
                <FileText size={20} color="#6B7280" />
                <Text style={styles.instructionsTitle}>Special Instructions</Text>
              </View>
              <Text style={styles.instructionsText}>{pet.special_instructions}</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  deleteButton: {
    marginLeft: 16,
  },
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
