import React from "react";
import { Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";

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

export default function PetsScreen() {
  const { user } = useAuth();
  const isPetOwner = user?.role === "pet_owner";
  const isPetSitter = user?.role === "pet_sitter";
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Pets</Text>
    </View>
  );
}
