import { router } from "expo-router";
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
import { initialValues, validateLoginForm } from "@/src/formValidations/loginForm";
import { useForm } from "@/src/hooks/useForm";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { signIn } = useAuth();
  const { inputs, errors, handleChange } = useForm({
    initialValues,
    validate: validateLoginForm,
  });

  async function handleLogin() {
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    try {
      const { error } = await signIn(inputs.email, inputs.password);

      if (error) {
        Alert.alert("Login Failed", error.message);
      } else {
        router.push("/(index)");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert("Login Failed", error.message);
      } else {
        Alert.alert("Login Failed", "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <KeyboardAvoidingView>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            }}
            style={styles.logo}
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>
        <View style={styles.form}>
          <TextInput
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={inputs.email}
            onChangeText={value => handleChange("email", value)}
            error={errors.email}
            leftIcon={<Mail size={20} color="#6B7280" />}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={inputs.password}
            onChangeText={value => handleChange("password", value)}
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

          <Button style={styles.forgotPassword}>Forgot Password?</Button>
          <Button onPress={handleLogin} loading={loading} style={styles.button}>
            Sign In
          </Button>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <Button onPress={() => router.push("/(auth)/register-form")}>Sign Up</Button>
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
    padding: 16,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#7C3AED",
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "baseline",
    marginTop: "auto",
    paddingVertical: 16,
  },
  footerText: {
    color: "#6B7280",
    fontSize: 16,
  },
  signUpText: {
    color: "#7C3AED",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
});
