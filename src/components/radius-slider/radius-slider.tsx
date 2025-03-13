import Slider from "@react-native-community/slider";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type RadiusSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export const RadiusSlider = React.memo(function RadiusSlider({
  value,
  onChange,
}: RadiusSliderProps) {
  return (
    <View style={styles.sliderContainer}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={50}
        step={1}
        value={value}
        onValueChange={onChange}
      />

      <Text style={styles.radiusValue}>Radius: {value.toString()} km</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  radiusValue: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#4B5563",
  },
});
