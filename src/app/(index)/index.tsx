import { MapPin, Star } from "lucide-react-native";
import React from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "@/src/context/AuthContext";

const FEATURED_SITTERS = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 4.9,
    reviews: 127,
    location: "Brooklyn, NY",
    price: 35,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    specialties: ["Dogs", "Cats"],
  },
  {
    id: "2",
    name: "Michael Chen",
    rating: 4.8,
    reviews: 93,
    location: "Manhattan, NY",
    price: 40,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    specialties: ["Dogs", "Small Pets"],
  },
];

const UPCOMING_BOOKINGS = [
  {
    id: "1",
    petOwner: "Jessica Wilson",
    petName: "Luna",
    petType: "Dog",
    date: "May 15, 2025",
    time: "9:00 AM - 11:00 AM",
    location: "Brooklyn, NY",
    image:
      "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "2",
    petOwner: "Michael Brown",
    petName: "Oliver",
    petType: "Cat",
    date: "May 18, 2025",
    time: "2:00 PM - 4:00 PM",
    location: "Manhattan, NY",
    image:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const isPetOwner = user?.user_role === "pet_owner";
  const isPetSitter = user?.user_role === "pet_sitter";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>{isPetOwner ? "Find Your Perfect" : "Welcome Back"}</Text>
        <Text style={styles.title}>{isPetOwner ? "Pet Sitter" : "Pet Sitter"}</Text>
      </View>

      {isPetOwner && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Pet Sitters</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sitterList}>
              {FEATURED_SITTERS.map(sitter => (
                <Pressable key={sitter.id} style={styles.sitterCard}>
                  <Image source={{ uri: sitter.image }} style={styles.sitterImage} />
                  <View style={styles.sitterInfo}>
                    <Text style={styles.sitterName}>{sitter.name}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#FBC02D" fill="#FBC02D" />
                      <Text style={styles.rating}>{sitter.rating}</Text>
                      <Text style={styles.reviews}>({sitter.reviews})</Text>
                    </View>
                    <View style={styles.locationContainer}>
                      <MapPin size={14} color="#6B7280" />
                      <Text style={styles.location}>{sitter.location}</Text>
                    </View>
                    <Text style={styles.price}>${sitter.price}/hour</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <Pressable style={styles.actionButton}>
                <Text style={styles.actionText}>Find a Sitter</Text>
              </Pressable>

              <Pressable style={styles.actionButton}>
                <Text style={styles.actionText}>Add a Pet</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}

      {/* Pet Sitter View */}
      {isPetSitter && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
            {UPCOMING_BOOKINGS.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No upcoming bookings</Text>
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.bookingList}
              >
                {UPCOMING_BOOKINGS.map(booking => (
                  <Pressable key={booking.id} style={styles.bookingCard}>
                    <Image source={{ uri: booking.image }} style={styles.bookingImage} />
                    <View style={styles.bookingInfo}>
                      <Text style={styles.petName}>{booking.petName}</Text>
                      <Text style={styles.petType}>{booking.petType}</Text>
                      <View style={styles.bookingDetail}>
                        <MapPin size={14} color="#6B7280" />
                        <Text style={styles.bookingText}>{booking.location}</Text>
                      </View>
                      <Text style={styles.bookingDate}>{booking.date}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <Pressable style={styles.actionButton}>
                <Text style={styles.actionText}>Find Jobs</Text>
              </Pressable>

              <Pressable style={styles.actionButton}>
                <Text style={styles.actionText}>View Schedule</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}
    </ScrollView>
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
    backgroundColor: "#7C3AED",
  },
  welcomeText: {
    fontSize: 20,
    color: "#E9D5FF",
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  sitterList: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  sitterCard: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sitterImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  sitterInfo: {
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
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7C3AED",
  },
  quickActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // Pet Sitter specific styles
  bookingList: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  bookingCard: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 16,
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
  bookingImage: {
    width: "100%",
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bookingInfo: {
    padding: 16,
  },
  petName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  petType: {
    fontSize: 14,
    color: "#7C3AED",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  bookingDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bookingText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  bookingDate: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7C3AED",
    marginTop: 8,
  },
  emptyState: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 16,
  },
});
