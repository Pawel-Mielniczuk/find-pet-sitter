import { LegendList } from "@legendapp/list";
import { Filter, Search as SearchIcon } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { renderSitterItem } from "@/src/components/sitter-item/sitter-item";

import { FilterModal } from "../../components/filter-modal/filter-modal";
import { useSearch } from "../../context/SearchContext";

export default function SearchScreen() {
  const {
    state,
    dispatch,
    handleSearchChange,
    handleSearchPress,

    filteredSitters,

    isLoading,
    error,
    refetch,
  } = useSearch();

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

      <FilterModal />
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
});
