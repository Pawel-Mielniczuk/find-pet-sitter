import React from "react";
import { StyleSheet, View } from "react-native";

type ProgressIndicatorProps = {
  currentStep: number;
  totalSteps?: number;
};

export function ProgressIndicator({ currentStep, totalSteps = 2 }: ProgressIndicatorProps) {
  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[styles.step, index + 1 <= currentStep ? styles.activeStep : styles.inactiveStep]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    gap: 8,
  },
  step: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  activeStep: {
    backgroundColor: "#3498db",
  },
  inactiveStep: {
    backgroundColor: "#e0e0e0",
  },
});
