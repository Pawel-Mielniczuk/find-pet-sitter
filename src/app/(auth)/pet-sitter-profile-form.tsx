import { router } from "expo-router";
import { Award, Briefcase, Clock, DollarSign, Shield } from "lucide-react-native";
import React from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { Button } from "../../components/button/Button";
import { TextInput } from "../../components/text-input/TextInput";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";

export default function PetSitterProfileScreen() {
  const [loading, setLoading] = React.useState(false);
  const { user } = useAuth();
  const [inputs, setInputs] = React.useState({
    price: "",
    yearsExperience: "",
    services: "",
    specialties: "",
    availabilityStatus: true,
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (!user) {
      router.replace("/(auth)/login-form");
    }
  }, [user]);

  const handleChange = (field: string, value: string | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!inputs.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(inputs.price)) || Number(inputs.price) <= 0) {
      newErrors.price = "Please enter a valid price";
    }

    if (!inputs.yearsExperience.trim()) {
      newErrors.yearsExperience = "Years of experience is required";
    } else if (isNaN(Number(inputs.yearsExperience)) || Number(inputs.yearsExperience) < 0) {
      newErrors.yearsExperience = "Please enter valid years of experience";
    }

    if (!inputs.services.trim()) {
      newErrors.services = "Services are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const servicesArray = Array.isArray(inputs.services)
        ? inputs.services
        : inputs.services.split(",").map(item => item.trim());

      const specialtiesArray = inputs.specialties
        ? Array.isArray(inputs.specialties)
          ? inputs.specialties
          : inputs.specialties.split(",").map(item => item.trim())
        : null;
      const { error } = await supabase
        .from("pet_sitter_profiles")
        .upsert({
          id: user?.id,
          price: Number(inputs.price),
          years_experience: Number(inputs.yearsExperience),
          services: servicesArray,
          specialties: specialtiesArray,
          availability_status: inputs.availabilityStatus,
          created_at: new Date(),
        })
        .select();

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
  };

  if (!user) return null;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Pet Sitter Profile</Text>
          <Text style={styles.subtitle}>Tell us about your services</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Price per Hour ($)"
            placeholder="Enter your hourly rate"
            keyboardType="numeric"
            value={inputs.price}
            onChangeText={value => handleChange("price", value)}
            error={errors.price}
            leftIcon={<DollarSign size={20} color="#6B7280" />}
          />

          <TextInput
            label="Years of Experience"
            placeholder="Enter years of experience"
            keyboardType="numeric"
            value={inputs.yearsExperience}
            onChangeText={value => handleChange("yearsExperience", value)}
            error={errors.yearsExperience}
            leftIcon={<Briefcase size={20} color="#6B7280" />}
          />

          <TextInput
            label="Services Offered"
            placeholder="e.g. Dog walking, Cat sitting, Pet feeding"
            value={inputs.services}
            onChangeText={value => handleChange("services", value)}
            error={errors.services}
            leftIcon={<Award size={20} color="#6B7280" />}
            multiline
            numberOfLines={3}
            style={styles.multiline}
          />

          <TextInput
            label="Specialties (Optional)"
            placeholder="e.g. Large dogs, Elderly pets, Medication administration"
            value={inputs.specialties}
            onChangeText={value => handleChange("specialties", value)}
            leftIcon={<Shield size={20} color="#6B7280" />}
            multiline
            numberOfLines={3}
            style={styles.multiline}
          />

          <View style={styles.switchContainer}>
            <View style={styles.switchLabel}>
              <Clock size={20} color="#6B7280" style={styles.switchIcon} />
              <Text style={styles.label}>Available for Booking</Text>
            </View>
            <Switch
              value={inputs.availabilityStatus}
              onValueChange={value => handleChange("availabilityStatus", value)}
              trackColor={{ false: "#D1D5DB", true: "#7C3AED" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <Button onPress={handleSubmit} loading={loading} style={styles.button}>
            Complete Pet Sitter Profile
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
  multiline: {
    height: 80,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchIcon: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  button: {
    marginTop: 16,
  },
});
