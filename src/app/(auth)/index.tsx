import { router } from "expo-router";
import React from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { Button } from "../../components/button/Button";
import { OnboardingSlide } from "../../components/onboarding-slide/onboarding-slide";
import { useAuth } from "../../context/AuthContext";

const slides = [
  {
    id: "1",
    title: "Find Trusted Pet Sitters",
    description:
      "Connect with experienced pet sitters in your area who will treat your pets like family.",
    image:
      "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "2",
    title: "Easy Booking Process",
    description: "Book pet sitters with just a few taps and manage your appointments effortlessly.",
    image:
      "https://images.unsplash.com/photo-1583511666372-62fc211f8377?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
  {
    id: "3",
    title: "Peace of Mind",
    description:
      "Receive updates and photos while you're away, so you always know your pets are happy and safe.",
    image:
      "https://images.unsplash.com/photo-1560743641-3914f2c45636?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  },
];

function PaginationDots({
  currentIndex,
  totalSlides,
  scrollX,
  width,
}: {
  currentIndex: number;
  totalSlides: number;
  scrollX: Animated.Value;
  width: number;
}) {
  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: totalSlides }).map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 20, 10],
          extrapolate: "clamp",
        });

        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp",
        });

        return (
          <Animated.View
            key={index.toString()}
            style={[styles.indicator, { width: dotWidth, opacity }]}
          />
        );
      })}
    </View>
  );
}

export default function OnBoardingScreen() {
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const slidesRef = React.useRef<FlatList>(null);
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const { user } = useAuth();
  const { width } = useWindowDimensions();

  React.useEffect(() => {
    if (user) {
      router.replace("/(index)");
    }
  }, [user]);

  if (user) return null;

  if (user) {
    router.replace("/(index)");
    return null;
  }

  const handleViewableItemsChanged = ({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const navigateToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(auth)/login-form");
    }
  };

  const skipToLogin = () => {
    router.replace("/(auth)/login-form");
  };

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        <Pressable onPress={skipToLogin}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>

      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={({ item }) => <OnboardingSlide {...item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 50,
        }}
        scrollEventThrottle={16}
      />

      <View style={styles.bottomContainer}>
        <PaginationDots
          currentIndex={currentIndex}
          totalSlides={slides.length}
          scrollX={scrollX}
          width={width}
        />

        <View style={styles.buttonContainer}>
          <Button onPress={navigateToNextSlide} style={styles.button}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  skipContainer: {
    position: "absolute",
    top: 60,
    right: 24,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    backgroundColor: "#7C3AED",
    marginHorizontal: 4,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    width: "100%",
  },
});
