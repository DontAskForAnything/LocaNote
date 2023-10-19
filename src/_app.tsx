import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainScreen } from "./screens/main/welcome";
import { RootStackParamList } from "./types/navigation";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import Constants from "expo-constants";
import WelcomeScreen from "./screens/auth/welcome";
import LogInStrategyScreen from "./screens/auth/logInStrategy";
import SignUpStrategyScreen from "./screens/auth/singUpStrategy";
import UsernameChooseScreen from "./screens/auth/username";
import ForgotPasswordSendCodeScreen from "./screens/auth/forgotPassword/sendCode";
import ForgotPasswordCodeVerifyScreen from "./screens/auth/forgotPassword/verifyCode";
import ForgotPasswordRestartScreen from "./screens/auth/forgotPassword/passwordReset";
import VerifyCodeScreen from "./screens/auth/verifyCode";
import SignUpScreen from "./screens/auth/signup";
import { useFonts, Poppins_500Medium } from "@expo-google-fonts/poppins";
import {
  OpenSans_400Regular,
  OpenSans_700Bold,
  OpenSans_600SemiBold,
} from "@expo-google-fonts/open-sans";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { CalendarScreen } from "./screens/calendar/main";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainScreen" component={MainScreen} />
    </Stack.Navigator>
  );
};

const CalenderStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="CalendarScreen"
      screenOptions={{ headerShown: false }}
    >
      {/* Here you can add all Screens :D */}
      <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="MainStack"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { display: "none" },
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "grey",
          tabBarStyle: {
            borderTopColor: "transparent",
            backgroundColor: "transparent",
            elevation: 0,
          },
        }}
      >
        <Tab.Screen
          name="MainStack"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={color}
              />
            ),
          }}
          component={MainStack}
        />
        <Tab.Screen
          name="CalenderStack"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={24}
                color={color}
              />
            ),
          }}
          component={CalenderStack}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export const App = () => {
  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_600SemiBold,
  });
  if (!fontsLoaded) {
    return <></>;
  }
  return (
    <ClerkProvider
      publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
    >
      <SignedIn>
        <AppNavigator />
      </SignedIn>
      <SignedOut>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen
              name="LogInStrategy"
              component={LogInStrategyScreen}
            />
            <Stack.Screen
              name="ForgotPasswordSendCode"
              component={ForgotPasswordSendCodeScreen}
            />

            <Stack.Screen
              name="ForgotPasswordCodeVerify"
              component={ForgotPasswordCodeVerifyScreen}
            />

            <Stack.Screen
              name="ForgotPasswordRestart"
              component={ForgotPasswordRestartScreen}
            />

            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen
              name="SignUpStrategy"
              component={SignUpStrategyScreen}
            />
            <Stack.Screen
              name="UsernameChoose"
              component={UsernameChooseScreen}
            />
            <Stack.Screen name="VerifyCode" component={VerifyCodeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SignedOut>
    </ClerkProvider>
  );
};
