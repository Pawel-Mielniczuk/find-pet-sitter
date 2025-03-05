import React from "react";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: string;
}

export function OnboardingSlide({ title, description, image }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Image
        testID="onboarding-image"
        source={{ uri: image }}
        style={[styles.image, { width: width * 0.8, height: width * 0.8 }]}
        resizeMode="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  image: {
    borderRadius: 24,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 24,
  },
});
