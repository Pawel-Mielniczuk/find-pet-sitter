export type SearchState = {
  searchQuery: string;
  filterModalVisible: boolean;
  selectedSpecialties: string[];
  selectedLocations: string[];
  selectedAvailability: string[];
  priceRange: [number, number];
  searchCity: string;
  shouldSearch: boolean;
  locationOptions: string[];
  searchRadius: number;
};

export const SEARCH_ACTIONS = {
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_FILTER_MODAL_VISIBLE: "SET_FILTER_MODAL_VISIBLE",
  TOGGLE_SPECIALTY: "TOGGLE_SPECIALTY",
  TOGGLE_LOCATION: "TOGGLE_LOCATION",
  TOGGLE_AVAILABILITY: "TOGGLE_AVAILABILITY",
  SET_PRICE_RANGE: "SET_PRICE_RANGE",
  SET_SEARCH_CITY: "SET_SEARCH_CITY",
  SET_SHOULD_SEARCH: "SET_SHOULD_SEARCH",
  ADD_LOCATION_OPTION: "ADD_LOCATION_OPTION",
  SET_LOCATION_OPTIONS: "SET_LOCATION_OPTIONS",
  SET_SEARCH_RADIUS: "SET_SEARCH_RADIUS",
  CLEAR_FILTERS: "CLEAR_FILTERS",
} as const;

export type SearchActionType = (typeof SEARCH_ACTIONS)[keyof typeof SEARCH_ACTIONS];

export type SearchAction =
  | { type: typeof SEARCH_ACTIONS.SET_SEARCH_QUERY; payload: string }
  | { type: typeof SEARCH_ACTIONS.SET_FILTER_MODAL_VISIBLE; payload: boolean }
  | { type: typeof SEARCH_ACTIONS.TOGGLE_SPECIALTY; payload: string }
  | { type: typeof SEARCH_ACTIONS.TOGGLE_LOCATION; payload: string }
  | { type: typeof SEARCH_ACTIONS.TOGGLE_AVAILABILITY; payload: string }
  | { type: typeof SEARCH_ACTIONS.SET_PRICE_RANGE; payload: [number, number] }
  | { type: typeof SEARCH_ACTIONS.SET_SEARCH_CITY; payload: string }
  | { type: typeof SEARCH_ACTIONS.SET_SHOULD_SEARCH; payload: boolean }
  | { type: typeof SEARCH_ACTIONS.ADD_LOCATION_OPTION; payload: string }
  | { type: typeof SEARCH_ACTIONS.SET_LOCATION_OPTIONS; payload: string[] }
  | { type: typeof SEARCH_ACTIONS.SET_SEARCH_RADIUS; payload: number }
  | { type: typeof SEARCH_ACTIONS.CLEAR_FILTERS };

export function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case SEARCH_ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case SEARCH_ACTIONS.SET_FILTER_MODAL_VISIBLE:
      return { ...state, filterModalVisible: action.payload };
    case SEARCH_ACTIONS.TOGGLE_SPECIALTY:
      return {
        ...state,
        selectedSpecialties: state.selectedSpecialties.includes(action.payload)
          ? state.selectedSpecialties.filter(specialty => specialty !== action.payload)
          : [...state.selectedSpecialties, action.payload],
      };
    case SEARCH_ACTIONS.TOGGLE_LOCATION:
      return {
        ...state,
        selectedLocations: state.selectedLocations.includes(action.payload)
          ? state.selectedLocations.filter(location => location !== action.payload)
          : [...state.selectedLocations, action.payload],
      };
    case SEARCH_ACTIONS.TOGGLE_AVAILABILITY:
      return {
        ...state,
        selectedAvailability: state.selectedAvailability.includes(action.payload)
          ? state.selectedAvailability.filter(availability => availability !== action.payload)
          : [...state.selectedAvailability, action.payload],
      };
    case SEARCH_ACTIONS.SET_PRICE_RANGE:
      return { ...state, priceRange: action.payload };
    case SEARCH_ACTIONS.SET_SEARCH_CITY:
      return { ...state, searchCity: action.payload };
    case SEARCH_ACTIONS.SET_SHOULD_SEARCH:
      return { ...state, shouldSearch: action.payload };
    case SEARCH_ACTIONS.ADD_LOCATION_OPTION:
      return {
        ...state,
        locationOptions: state.locationOptions.includes(action.payload)
          ? state.locationOptions
          : [...state.locationOptions, action.payload],
      };
    case SEARCH_ACTIONS.SET_LOCATION_OPTIONS:
      return {
        ...state,
        locationOptions: [...new Set(action.payload)],
      };
    case SEARCH_ACTIONS.SET_SEARCH_RADIUS:
      return { ...state, searchRadius: action.payload };
    case SEARCH_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        selectedSpecialties: [],
        selectedLocations: [],
        selectedAvailability: [],
        priceRange: [0, 100],
        searchRadius: 10,
      };
    default:
      return state;
  }
}
