import { LegendList } from "@legendapp/list";
import { Check, X } from "lucide-react-native";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";
import { RadiusSlider } from "../radius-slider/radius-slider";

export function FilterModal() {
  const { user } = useAuth();
  const {
    state,
    dispatch,
    specialtyOptions,
    toggleSpecialty,
    toggleLocation,
    AVAILABILITY,
    toggleAvailability,
    clearFilters,
    applyFilters,
    handleRadiusChange,
  } = useSearch();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={state.filterModalVisible}
      onRequestClose={() => dispatch({ type: "SET_FILTER_MODAL_VISIBLE", payload: false })}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Pet Sitters</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => dispatch({ type: "SET_FILTER_MODAL_VISIBLE", payload: false })}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <LegendList
            data={[
              {
                title: "Specialties",
                items: specialtyOptions,
                selected: state.selectedSpecialties,
                onToggle: toggleSpecialty,
              },
              {
                title: "Location",
                items: state.locationOptions,
                selected: state.selectedLocations,
                onToggle: toggleLocation,
              },
              {
                title: "Availability",
                items: AVAILABILITY,
                selected: state.selectedAvailability,
                onToggle: toggleAvailability,
              },
            ]}
            renderItem={({ item: section }) => (
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>{section.title}</Text>
                <View style={styles.filterOptions}>
                  {section.items.map(item => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.filterOption,
                        section.selected.includes(item) && styles.filterOptionSelected,
                      ]}
                      onPress={() => section.onToggle(item)}
                    >
                      <Text
                        style={[
                          styles.filterOptionText,
                          section.selected.includes(item) && styles.filterOptionTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                      {section.selected.includes(item) && <Check size={16} color="#FFFFFF" />}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            keyExtractor={item => item.title}
            ListFooterComponent={
              <>
                {user?.latitude && user?.longitude && (
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Search Radius</Text>
                    <RadiusSlider value={state.searchRadius} onChange={handleRadiusChange} />
                  </View>
                )}
                <View style={styles.filterActions}>
                  <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
                    <Text style={styles.clearButtonText}>Clear All</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
                    <Text style={styles.applyButtonText}>Apply Filters</Text>
                  </TouchableOpacity>
                </View>
              </>
            }
            estimatedItemSize={20}
            style={styles.modalBody}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  filterOptionSelected: {
    backgroundColor: "#7C3AED",
  },
  filterOptionText: {
    color: "#4B5563",
    fontSize: 14,
    fontWeight: "500",
  },
  filterOptionTextSelected: {
    color: "#FFFFFF",
  },
  filterActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  clearButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
