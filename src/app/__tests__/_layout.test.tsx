import { renderRouter, screen } from "expo-router/testing-library";
import { View } from "react-native";

describe("Expo Router Navigation", () => {
  it("renders index route correctly", async () => {
    const IndexScreen = jest.fn(() => <View testID="index-screen" />);

    renderRouter(
      {
        index: IndexScreen,
      },
      {
        initialUrl: "/",
      },
    );

    expect(screen).toHavePathname("/");
    expect(screen.getByTestId("index-screen")).toBeTruthy();
  });

  it("navigates to auth routes correctly", async () => {
    const LoginScreen = jest.fn(() => <View testID="login-screen" />);
    const RegisterScreen = jest.fn(() => <View testID="register-screen" />);

    renderRouter(
      {
        "(auth)/login": LoginScreen,
        "(auth)/register": RegisterScreen,
      },
      {
        initialUrl: "/login",
      },
    );

    expect(screen).toHavePathname("/login");
    expect(screen.getByTestId("login-screen")).toBeTruthy();
  });

  it("handles nested routes", async () => {
    const ProfileScreen = jest.fn(() => <View testID="profile-screen" />);
    const SettingsScreen = jest.fn(() => <View testID="settings-screen" />);

    renderRouter(
      {
        "(index)/profile": ProfileScreen,
        "(index)/settings": SettingsScreen,
      },
      {
        initialUrl: "/profile",
      },
    );

    expect(screen).toHavePathname("/profile");
    expect(screen.getByTestId("profile-screen")).toBeTruthy();
  });
});
