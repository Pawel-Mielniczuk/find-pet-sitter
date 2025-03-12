import { useQuery } from "@tanstack/react-query";
import React from "react";

import { useAuth } from "../context/AuthContext";
import { fetchPetSitters } from "../lib/api";
import { queryClient } from "../lib/queryClient";
import { PetSitter } from "../lib/types";
import {
  SEARCH_ACTIONS,
  SearchAction,
  searchReducer,
  SearchState,
} from "../reducers/SearchReducer";

const AVAILABILITY = ["Available Now", "Today", "This Week", "Next Week"];

type SearchContextType = {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  handleSearchChange: (text: string) => void;
  handleSearchPress: () => void;
  toggleSpecialty: (specialty: string) => void;
  toggleLocation: (location: string) => void;
  toggleAvailability: (availability: string) => void;
  handleRadiusChange: (value: number) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  sitters: PetSitter[];
  filteredSitters: PetSitter[];
  specialtyOptions: string[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  AVAILABILITY: string[];
};

const extractCity = (location: string | null | undefined): string => {
  if (!location) return "";
  return location.split(",")[0].trim();
};

const initialState: SearchState = {
  searchQuery: "",
  filterModalVisible: false,
  selectedSpecialties: [],
  selectedLocations: [],
  selectedAvailability: [],
  priceRange: [0, 100],
  searchCity: "",
  shouldSearch: false,
  locationOptions: [],
  searchRadius: 10,
};

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = React.useReducer(searchReducer, initialState);
  const { user } = useAuth();
  const searchRadiusRef = React.useRef(state.searchRadius);

  React.useEffect(() => {
    searchRadiusRef.current = state.searchRadius;
  }, [state.searchRadius]);

  React.useEffect(() => {
    if (user && user.location) {
      const city = extractCity(user.location);
      dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_CITY, payload: city });

      const locationOptions = [...new Set(user.location ? [user.location] : [])];
      dispatch({ type: SEARCH_ACTIONS.SET_LOCATION_OPTIONS, payload: locationOptions });
      dispatch({ type: SEARCH_ACTIONS.SET_SHOULD_SEARCH, payload: true });
    }
  }, [user]);

  const {
    data: sitters = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["petSitters", state.searchCity, state.shouldSearch],
    queryFn: async () => {
      if (searchRadiusRef.current) {
        return fetchPetSitters(state.searchCity, null, null, searchRadiusRef.current);
      } else {
        return fetchPetSitters(state.searchCity, null, null, null);
      }
    },
    select: (data: PetSitter[]): PetSitter[] =>
      data.map((sitter: PetSitter) => ({
        id: sitter.id,
        first_name: sitter.first_name,
        last_name: sitter.last_name,
        location: sitter.location,
        image: sitter.image,
        price: sitter.price,
        years_experience: sitter.years_experience,
        services: sitter.services,
        specialties: sitter.specialties,
        availability_status: sitter.availability_status,
        bio: sitter.bio,
        rating: sitter.rating,
      })),
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled: state.shouldSearch && !!state.searchCity,
  });

  const specialtyOptions = React.useMemo(() => {
    if (!sitters || sitters.length === 0) return [];

    const allSpecialties = sitters.reduce<string[]>((acc, sitter) => {
      if (sitter.specialties && Array.isArray(sitter.specialties)) {
        return [...acc, ...sitter.specialties];
      }
      return acc;
    }, []);

    return [...new Set(allSpecialties)].sort();
  }, [sitters]);

  const handleSearchChange = (text: string) => {
    dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_QUERY, payload: text });
  };

  const handleSearchPress = async () => {
    const city = extractCity(state.searchQuery.trim());
    if (city) {
      dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_CITY, payload: city });
      dispatch({ type: SEARCH_ACTIONS.SET_SHOULD_SEARCH, payload: true });

      if (state.searchQuery.trim() !== "" && !state.locationOptions.includes(state.searchQuery)) {
        dispatch({ type: SEARCH_ACTIONS.ADD_LOCATION_OPTION, payload: state.searchQuery.trim() });
        dispatch({
          type: SEARCH_ACTIONS.SET_LOCATION_OPTIONS,
          payload: [...state.locationOptions, state.searchQuery.trim()],
        });
        dispatch({ type: SEARCH_ACTIONS.TOGGLE_LOCATION, payload: state.searchQuery.trim() });
      }
    }
  };
  const toggleSpecialty = (specialty: string) => {
    dispatch({ type: SEARCH_ACTIONS.TOGGLE_SPECIALTY, payload: specialty });
  };

  const toggleLocation = (location: string) => {
    dispatch({ type: SEARCH_ACTIONS.TOGGLE_LOCATION, payload: location });
  };

  const toggleAvailability = (availability: string) => {
    dispatch({ type: SEARCH_ACTIONS.TOGGLE_AVAILABILITY, payload: availability });
  };

  const handleRadiusChange = React.useCallback((value: number) => {
    dispatch({ type: SEARCH_ACTIONS.SET_SEARCH_RADIUS, payload: value });
    searchRadiusRef.current = value;
  }, []);

  const filterSitters = React.useCallback(() => {
    if (!sitters) return [];

    return sitters.filter(sitter => {
      const matchesSpecialty =
        state.selectedSpecialties.length === 0 ||
        (sitter.specialties &&
          state.selectedSpecialties.some(specialty => sitter.specialties?.includes(specialty)));

      const matchesPrice =
        !sitter.price ||
        (sitter.price >= state.priceRange[0] && sitter.price <= state.priceRange[1]);

      return matchesSpecialty && matchesPrice;
    });
  }, [state.selectedSpecialties, state.priceRange, sitters]);

  const filteredSitters = filterSitters();

  const clearFilters = () => {
    dispatch({ type: SEARCH_ACTIONS.CLEAR_FILTERS });
  };
  const applyFilters = () => {
    dispatch({ type: SEARCH_ACTIONS.SET_FILTER_MODAL_VISIBLE, payload: false });
    searchRadiusRef.current = state.searchRadius;
    dispatch({ type: SEARCH_ACTIONS.SET_SHOULD_SEARCH, payload: true });
    queryClient.invalidateQueries({ queryKey: ["petSitters"] });
  };

  const value = {
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
    sitters,
    filteredSitters,
    specialtyOptions,
    isLoading,
    error,
    refetch,
    AVAILABILITY,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearch = () => {
  const context = React.useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};
