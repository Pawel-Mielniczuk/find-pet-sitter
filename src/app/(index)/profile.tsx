import { Redirect } from "expo-router";
import {
  Bell,
  CircleHelp as HelpCircle,
  CreditCard,
  LogOut,
  Settings,
  Shield,
} from "lucide-react-native";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../context/AuthContext";

const MENU_ITEMS = [
  {
    icon: Settings,
    label: "Account Settings",
    href: "/settings",
  },
  {
    icon: CreditCard,
    label: "Payment Methods",
    href: "/payments",
  },
  {
    icon: Bell,
    label: "Notifications",
    href: "/notifications",
  },
  {
    icon: Shield,
    label: "Privacy & Security",
    href: "/privacy",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    href: "/support",
  },
];

export default function ProfilesScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    return <Redirect href={"/(auth)/login-form"} />;
  };

  function getFullName() {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return "User";
  }

  function getUserTypeLabel() {
    if (user?.user_role === "pet_owner") {
      return "Pet Owner";
    } else if (user?.user_role === "pet_sitter") {
      return "Pet Sitter";
    }
    return "";
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb" }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{getFullName()}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            {user?.role && (
              <View style={styles.userTypeContainer}>
                <Text style={styles.userTypeText}>{getUserTypeLabel()}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={styles.menuSection}>
        {MENU_ITEMS.map((item, index) => (
          <Pressable
            key={item.label}
            style={[styles.menuItem, index !== MENU_ITEMS.length - 1 && styles.menuItemBorder]}
          >
            <View style={styles.menuItemContent}>
              <item.icon size={24} color="#6B7280" />
              <Text style={styles.menuItemLabel}>{item.label}</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#EF4444" />
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
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
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  },
  userTypeContainer: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  userTypeText: {
    color: "#7C3AED",
    fontWeight: "500",
    fontSize: 14,
  },
  menuSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: "#111827",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginTop: 24,
    padding: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#EF4444",
  },
});
