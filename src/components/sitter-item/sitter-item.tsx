import { Image } from "expo-image";
import { Link } from "expo-router";
import { MapPin } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PetSitter } from "@/src/lib/types";

export function renderSitterItem({ item }: { item: PetSitter }) {
  return (
    <Link
      href={{
        pathname: `/(index)/sitter/[id]`,
        params: {
          id: item.id,
          sitterData: JSON.stringify(item),
        },
      }}
      asChild
    >
      <Pressable style={styles.sitterCard}>
        <Image
          source={{
            uri: item.image
              ? item.image
              : "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          }}
          style={styles.sitterImage}
        />
        <View style={styles.sitterInfo}>
          <Text style={styles.sitterName}>{`${item.first_name} ${item.last_name}`}</Text>

          {item.location && (
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.location}>{item.location}</Text>
            </View>
          )}

          {item.specialties && item.specialties.length > 0 && (
            <View style={styles.specialtiesContainer}>
              {item.specialties.map((specialty: any, index: any) => (
                <View key={specialty} style={styles.specialtyTag}>
                  <Text style={styles.specialtyText}>{specialty}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.footer}>
            <Text style={styles.price}>${String(item.price)}/hour</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  sitterCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  sitterImage: {
    width: 120,
    height: "100%",
  },
  sitterInfo: {
    flex: 1,
    padding: 16,
  },
  sitterName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7C3AED",
  },
});
