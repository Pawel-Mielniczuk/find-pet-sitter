import { Redirect, router } from "expo-router";
import { Eye, EyeOff, Lock, Mail } from "lucide-react-native";
import React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Button } from "@/src/components/button/Button";
import { TextInput } from "@/src/components/text-input/TextInput";
import { useAuth } from "@/src/context/AuthContext";

export default function RegisterScreen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { signUp } = useAuth();

  function validateForm() {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password.trim() !== confirmPassword.trim()) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validateForm()) return;

    setLoading(true);

    try {
      await signUp(email, password, confirmPassword);
      // router.push("/(auth)/complete-profile");
      return <Redirect href={"/(auth)/complete-profile"} />;
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1583511666372-62fc211f8377?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            leftIcon={<Mail size={20} color="#6B7280" />}
          />

          <TextInput
            label="Password"
            placeholder="Create a password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            leftIcon={<Lock size={20} color="#6B7280" />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            }
          />
          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={errors.confirmPassword}
            leftIcon={<Lock size={20} color="#6B7280" />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            }
          />

          <Button onPress={handleRegister} loading={loading} style={styles.button}>
            Sign Up
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
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
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
  button: {
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "auto",
    paddingVertical: 16,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 16,
  },
  signInText: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
});
