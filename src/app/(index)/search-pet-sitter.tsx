import { LegendList } from "@legendapp/list";
import Slider from "@react-native-community/slider";
import { Link } from "expo-router";
import { Check, Filter, MapPin, Search as SearchIcon, X } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/src/context/AuthContext";

import { useSearch } from "../../context/SearchContext";
import { PetSitter } from "../../lib/types";

type RadiusSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

const RadiusSlider = React.memo(function RadiusSlider({ value, onChange }: RadiusSliderProps) {
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

export default function SearchScreen() {
  const { user } = useAuth();

  const {
    state,
    dispatch,
    handleSearchChange,
    handleSearchPress,
    toggleSpecialty,
    toggleLocation,
    toggleAvailability,
    handleRadiusChange,
    clearFilters,
    applyFilters,
    filteredSitters,
    specialtyOptions,
    isLoading,
    error,
    refetch,
    AVAILABILITY,
  } = useSearch();

  const renderSitterItem = ({ item }: { item: PetSitter }) => {
    return (
      <Link
        href={{
          pathname: `/(index)/sitter/[id]`,
          params: {
            id: item.id,
            sitterData: JSON.stringify(item),
          },
        }}
        asChild
      >
        <Pressable style={styles.sitterCard}>
          <Image
            source={{
              uri: item.image
                ? item.image
                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            }}
            style={styles.sitterImage}
          />
          <View style={styles.sitterInfo}>
            <Text style={styles.sitterName}>{`${item.first_name} ${item.last_name}`}</Text>

            {item.location && (
              <View style={styles.locationContainer}>
                <MapPin size={14} color="#6B7280" />
                <Text style={styles.location}>{item.location}</Text>
              </View>
            )}

            {item.specialties && item.specialties.length > 0 && (
              <View style={styles.specialtiesContainer}>
                {item.specialties.map((specialty: any, index: any) => (
                  <View key={specialty} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.footer}>
              <Text style={styles.price}>${String(item.price)}/hour</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };

  if (isLoading && filteredSitters.length === 0) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Finding pet sitters in {state.searchCity}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or location..."
            value={state.searchQuery}
            onChangeText={handleSearchChange}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearchPress}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        <Pressable
          style={[
            styles.filterButton,
            (state.selectedSpecialties.length > 0 ||
              state.selectedLocations.length > 0 ||
              state.selectedAvailability.length > 0) &&
              styles.filterButtonActive,
          ]}
          onPress={() => dispatch({ type: "SET_FILTER_MODAL_VISIBLE", payload: true })}
        >
          <Filter
            size={20}
            color={
              state.selectedSpecialties.length > 0 ||
              state.selectedLocations.length > 0 ||
              state.selectedAvailability.length > 0
                ? "#FFFFFF"
                : "#7C3AED"
            }
          />
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error instanceof Error
              ? error.message
              : "Failed to load pet sitters. Please try again."}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              dispatch({ type: "SET_SHOULD_SEARCH", payload: true });
              refetch();
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {isLoading && filteredSitters.length > 0 && (
            <View style={styles.refreshIndicator}>
              <ActivityIndicator size="small" color="#7C3AED" />
            </View>
          )}

          {!state.shouldSearch && filteredSitters.length === 0 ? (
            <View style={styles.initialSearchState}>
              <SearchIcon size={48} color="#7C3AED" />
              <Text style={styles.initialSearchStateTitle}>Search for Pet Sitters</Text>
              <Text style={styles.initialSearchStateText}>
                Enter a location and press Search to find available pet sitters
              </Text>
            </View>
          ) : (
            <LegendList
              data={filteredSitters}
              renderItem={renderSitterItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No pet sitters found</Text>
                  <Text style={styles.emptyStateText}>
                    Try adjusting your search criteria or filters
                  </Text>
                </View>
              }
              estimatedItemSize={200}
            />
          )}
        </>
      )}

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centeredContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  refreshIndicator: {
    padding: 12,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  searchButton: {
    backgroundColor: "#7C3AED",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  filterButton: {
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#7C3AED",
  },
  listContent: {
    padding: 24,
  },
  initialSearchState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  initialSearchStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  initialSearchStateText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  sitterCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: "hidden",
  },
  sitterImage: {
    width: 120,
    height: "100%",
  },
  sitterInfo: {
    flex: 1,
    padding: 16,
  },
  sitterName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 4,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  specialtyTag: {
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  specialtyText: {
    color: "#7C3AED",
    fontSize: 12,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7C3AED",
  },
  availability: {
    fontSize: 14,
    fontWeight: "500",
  },
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
  emptyState: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
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
