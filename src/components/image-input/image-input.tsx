import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { usePets } from "../../context/PetsContext";

export function ImageInput() {
  const { newPet, setNewPet } = usePets();

  async function pickImage() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewPet({ ...newPet, image: result.assets[0].uri });
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={pickImage}>
        <Camera size={24} color="#6B7280" />
      </Pressable>
      {newPet.image && <Image source={{ uri: newPet.image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6B7280",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    borderRadius: 100,
  },
});
