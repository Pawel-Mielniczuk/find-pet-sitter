import { Tabs } from "expo-router";
import {
  Briefcase,
  Calendar,
  House,
  MessageCircle,
  PawPrint,
  Search,
  User2,
} from "lucide-react-native";
import React from "react";
import { ActivityIndicator, View } from "react-native";

import { useAuth, UserRole } from "@/src/context/AuthContext";

export default function TabLayout() {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!user) return;

  const isPetSitter = user?.user_role === UserRole.PET_SITTER;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search-pet-sitter"
        options={
          isPetSitter
            ? { href: null }
            : {
                title: "Search",
                tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
              }
        }
      />
      <Tabs.Screen
        name="pets"
        options={
          isPetSitter
            ? { href: null }
            : {
                title: "My Pets",
                tabBarIcon: ({ color, size }) => <PawPrint size={size} color={color} />,
              }
        }
      />

      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="booking"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={
          isPetSitter
            ? {
                title: "Available Jobs",
                tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
              }
            : { href: null }
        }
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User2 size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
