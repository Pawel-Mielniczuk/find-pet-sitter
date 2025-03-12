import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, MapPin, MessageCircle, Shield, Star } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { PetSitter } from "@/src/lib/types";

const SITTER = {
  id: "1",
  name: "Sarah Johnson",
  rating: 4.9,
  reviews: 127,
  location: "Brooklyn, NY",
  price: 35,
  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  specialties: ["Dogs", "Cats"],
  availability: "Available Now",
  experience: "5 years",
  description:
    "Passionate pet sitter with experience in caring for both dogs and cats. Certified in pet first aid and animal behavior. I provide personalized care for each pet, ensuring they feel comfortable and happy while their owners are away.",
  verifications: ["Identity Verified", "Background Check", "Pet First Aid Certified"],
  schedule: [
    { day: "Monday", hours: "9:00 AM - 6:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
    { day: "Friday", hours: "9:00 AM - 6:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Not Available" },
  ],
  recentReviews: [
    {
      id: "1",
      user: "Emily R.",
      rating: 5,
      date: "2 days ago",
      comment:
        "Sarah was amazing with my dog Max! She sent regular updates and photos. Will definitely book again.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
    {
      id: "2",
      user: "Michael K.",
      rating: 5,
      date: "1 week ago",
      comment: "Very professional and caring. My cats were well taken care of.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
  ],
};

export default function SitterProfileScreen() {
  const { sitterData } = useLocalSearchParams();

  const sitter: PetSitter = JSON.parse(sitterData as string);

  const handleStartChat = () => {
    // This will be implemented later
  };

  const handleBook = () => {
    // Navigate to booking screen
  };

  if (!sitterData) {
    return (
      <View>
        <Text>Sitter profile not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/search-pet-sitter")}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pet Sitter Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: SITTER.image }} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{`${sitter.first_name} ${sitter.last_name}`}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FBC02D" fill="#FBC02D" />
              <Text style={styles.rating}>{SITTER.rating}</Text>
              <Text style={styles.reviews}>({SITTER.reviews} reviews)</Text>
            </View>
            <View style={styles.locationContainer}>
              <MapPin size={14} color="#6B7280" />
              <Text style={styles.location}>{sitter.location}</Text>
            </View>
            <Text style={styles.price}>${sitter.price}/hour</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{sitter.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialties</Text>
          <View style={styles.specialtiesContainer}>
            {sitter?.specialties?.map(specialty => (
              <View key={specialty} style={styles.specialtyTag}>
                <Text style={styles.specialtyText}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verifications</Text>
          <View style={styles.verificationsContainer}>
            {SITTER.verifications.map(verification => (
              <View key={verification} style={styles.verificationItem}>
                <Shield size={16} color="#059669" />
                <Text style={styles.verificationText}>{verification}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.scheduleContainer}>
            {SITTER.schedule.map(schedule => (
              <View key={schedule.day} style={styles.scheduleItem}>
                <Text style={styles.scheduleDay}>{schedule.day}</Text>
                <Text style={styles.scheduleHours}>{schedule.hours}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Reviews</Text>
          {SITTER.recentReviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: review.avatar }} style={styles.reviewerAvatar} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>{review.user}</Text>
                  <View style={styles.reviewRating}>
                    <Star size={14} color="#FBC02D" fill="#FBC02D" />
                    <Text style={styles.reviewRatingText}>{review.rating}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.chatButton} onPress={handleStartChat}>
          <MessageCircle size={24} color="#7C3AED" />
        </TouchableOpacity>
        <Pressable style={styles.bookButton} onPress={handleBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </Pressable>
      </View>
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
  content: {
    flex: 1,
  },
  profileHeader: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
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
    fontSize: 18,
    fontWeight: "600",
    color: "#7C3AED",
  },
  section: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 24,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "500",
  },
  verificationsContainer: {
    gap: 12,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verificationText: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "500",
  },
  scheduleContainer: {
    gap: 12,
  },
  scheduleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  scheduleDay: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  scheduleHours: {
    fontSize: 14,
    color: "#6B7280",
  },
  reviewCard: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewRatingText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    marginLeft: 4,
  },
  reviewDate: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 12,
  },
  chatButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  bookButton: {
    flex: 1,
    backgroundColor: "#7C3AED",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
