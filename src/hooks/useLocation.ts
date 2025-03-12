import * as Location from "expo-location";
import { useState } from "react";
import { Alert } from "react-native";

type LocationState = {
  location: string;
  latitude: string | null;
  longitude: string | null;
};

type UseLocationReturn = {
  locationData: LocationState;
  isLoading: boolean;
  getCurrentLocation: () => Promise<void>;
  setLocationData: (data: Partial<LocationState>) => void;
  error: string | null;
};

export const useLocation = (initialState?: Partial<LocationState>): UseLocationReturn => {
  const [locationData, setLocationDataState] = useState<LocationState>({
    location: initialState?.location || "",
    latitude: initialState?.latitude || null,
    longitude: initialState?.longitude || null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const setLocationData = (data: Partial<LocationState>) => {
    setLocationDataState(prev => ({ ...prev, ...data }));
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setError("Permission to access location was denied");
        Alert.alert(
          "Location Permission",
          "Permission to access location was denied. Please enter your location manually.",
          [{ text: "OK" }],
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({});

      const geocode = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      if (geocode && geocode.length > 0) {
        const address = geocode[0];
        const city = address.city || "";

        setLocationDataState({
          location: city.trim(),
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        });
      } else {
        setError("Could not determine your city");
        Alert.alert("Location Error", "Could not determine your city. Please enter manually.");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get your current location";
      setError(errorMessage);
      Alert.alert("Location Error", "Failed to get your current location. Please enter manually.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    locationData,
    isLoading,
    getCurrentLocation,
    setLocationData,
    error,
  };
};
