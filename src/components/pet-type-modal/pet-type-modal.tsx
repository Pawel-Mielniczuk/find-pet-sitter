import React from "react";
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface PetTypeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
  petTypes: string[];
}

export function PetTypeModal({ visible, onClose, onSelectType, petTypes }: PetTypeModalProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.content}>
          <Text style={styles.title}>Select Pet Type</Text>
          <FlatList
            data={petTypes}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.typeItem} onPress={() => onSelectType(item)}>
                <Text style={styles.typeItemText}>{item}</Text>
              </TouchableOpacity>
            )}
            style={styles.typeList}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "100%",
    maxHeight: "80%",
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  typeList: {
    maxHeight: 400,
  },
  typeItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  typeItemText: {
    fontSize: 16,
    color: "#111827",
    textAlign: "center",
  },
});
