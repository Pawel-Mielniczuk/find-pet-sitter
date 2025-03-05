import { ActivityIndicator, Pressable, StyleSheet, Text, TextStyle, ViewStyle } from "react-native";

export const zincColors = {
  50: "#fafafa",
  100: "#f4f4f5",
  200: "#e4e4e7",
  300: "#d4d4d8",
  400: "#a1a1aa",
  500: "#71717a",
  600: "#52525b",
  700: "#3f3f46",
  800: "#27272a",
  900: "#18181b",
  950: "#09090b",
};

const Red = "#FF3B30";

type ButtonVariant = "filled" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function Button({
  onPress,
  variant = "filled",
  size = "md",
  disabled = false,
  loading = false,
  children,
  style,
  textStyle,
}: ButtonProps) {
  const sizeStyles: Record<ButtonSize, { height: number; fontSize: number; padding: number }> = {
    sm: { height: 36, fontSize: 14, padding: 12 },
    md: { height: 44, fontSize: 16, padding: 16 },
    lg: { height: 55, fontSize: 18, padding: 20 },
  };

  const getVariantStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    };

    switch (variant) {
      case "filled":
        return {
          ...baseStyle,
          backgroundColor: zincColors[900],
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: zincColors[300],
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
    }
  };

  const getTextColor = () => {
    if (disabled) {
      return zincColors[400];
    }

    switch (variant) {
      case "filled":
        return zincColors[50];
      case "outline":
      case "ghost":
        return Red;
    }
  };

  return (
    <Pressable
      testID="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        getVariantStyle(),
        {
          height: sizeStyles[size].height,
          paddingHorizontal: sizeStyles[size].padding,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={StyleSheet.flatten([
            {
              fontSize: sizeStyles[size].fontSize,
              color: getTextColor(),
              textAlign: "center",
              marginBottom: 0,
              fontWeight: "700",
            },
            textStyle,
          ])}
        >
          {children}
        </Text>
      )}
    </Pressable>
  );
}
