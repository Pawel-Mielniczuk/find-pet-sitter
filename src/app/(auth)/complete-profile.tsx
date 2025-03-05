import { router } from "expo-router";
import { MapPin, Phone, User } from "lucide-react-native";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  initialValues,
  validateCompleteProfileForm,
} from "@/src/formValidations/completeProfileForm";
import { useForm } from "@/src/hooks/useForm";

import { Button } from "../../components/button/Button";
import { TextInput } from "../../components/text-input/TextInput";
import { useAuth } from "../../context/AuthContext";

export default function CompleteProfileScreen() {
  const [loading, setLoading] = React.useState(false);

  const { user, updateUserProfile, loading: authLoading } = useAuth();
  const { inputs, errors, handleChange } = useForm({
    initialValues,
    validate: validateCompleteProfileForm,
  });

  React.useEffect(() => {
    if (!user && !authLoading) {
      router.replace("/(auth)/login-form");
    }
  }, [user, authLoading]);

  if (authLoading) {
    return <Text>Loading...</Text>;
  }

  if (!user) {
    return null;
  }

  async function handleCompleteProfile() {
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const { error } = await updateUserProfile({
        first_name: inputs.firstName,
        last_name: inputs.lastName,
        phone_number: inputs.phone,
        location: inputs.location,
        role: inputs.userType,
        email: user?.email,
        created_at: new Date(),
      });

      if (error) {
        Alert.alert("Profile Update Failed", error.message);
      } else {
        router.replace("/(index)");
      }
    } catch (error: any) {
      Alert.alert("Profile Update Failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="First Name"
            placeholder="Enter your first name"
            value={inputs.firstName}
            onChangeText={value => handleChange("firstName", value)}
            error={errors.firstName}
            leftIcon={<User size={20} color="#6B7280" />}
          />

          <TextInput
            label="Last Name"
            placeholder="Enter your last name"
            value={inputs.lastName}
            onChangeText={value => handleChange("lastName", value)}
            error={errors.lastName}
            leftIcon={<User size={20} color="#6B7280" />}
          />

          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={inputs.phone}
            onChangeText={value => handleChange("phone", value)}
            error={errors.phone}
            leftIcon={<Phone size={20} color="#6B7280" />}
          />

          <TextInput
            label="Location"
            placeholder="City, State"
            value={inputs.location}
            onChangeText={value => handleChange("location", value)}
            error={errors.location}
            leftIcon={<MapPin size={20} color="#6B7280" />}
          />

          <Text style={styles.roleLabel}>I am a:</Text>
          {errors.userType && <Text style={styles.errorText}>{errors.userType}</Text>}

          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                inputs.userType === "pet_owner" && styles.roleButtonActive,
              ]}
              onPress={() => handleChange("userType", "pet_owner")}
            >
              <Text
                style={[styles.roleText, inputs.userType === "pet_owner" && styles.roleTextActive]}
              >
                Pet Owner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                inputs.userType === "pet_sitter" && styles.roleButtonActive,
              ]}
              onPress={() => handleChange("userType", "pet_sitter")}
            >
              <Text
                style={[styles.roleText, inputs.userType === "pet_sitter" && styles.roleTextActive]}
              >
                Pet Sitter
              </Text>
            </TouchableOpacity>
          </View>

          <Button onPress={handleCompleteProfile} loading={loading} style={styles.button}>
            Complete Profile
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 8,
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  roleButton: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    alignItems: "center",
    marginRight: 12,
  },
  roleButtonActive: {
    borderColor: "#7C3AED",
    backgroundColor: "#F3E8FF",
  },
  roleText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  roleTextActive: {
    color: "#7C3AED",
  },
  button: {
    marginTop: 16,
  },
});
