import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { AddSubjectScreen } from "./screens/main/addSubject";
import { SubjectScreen } from "./screens/main/subject";
import { SettingsScreen } from "./screens/account/settings/settings";
import { EditSubjectScreen } from "./screens/main/EditSubjectScreen";
import { TopicScreen } from "./screens/main/topic";
import { FlashcardsScreen } from "./screens/main/flashcards";
import { PrepareFlashcardsScreen } from "./screens/main/prepareFlashcards";
import AiErrorScreen from "./screens/error/ai";
import NetInfo from "@react-native-community/netinfo";
import { NoInternetScreen } from "./screens/error/noInternet";
import CreateTopicScreen from "./screens/main/createTopic";
import { Ionicons } from "@expo/vector-icons";
import { MainSharedScreen } from "./screens/shared/mainScreen";
import EditTopicScreen from "./screens/main/editTopicScreen";
import * as SecureStore from "expo-secure-store";
import { TokenCache } from "@clerk/clerk-expo/dist/cache";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootStackParamList>();

const AppStack = () => {
  return (
    <Tab.Navigator
      initialRouteName="MainScreen"
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: { display: "none" },
        // Set the colors for both active and inactive icons below.
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          borderTopColor: "transparent",
          backgroundColor: "#1B1B1B",
          elevation: 0,
        },
      }}
    >
      <Tab.Screen
        name="MainScreen"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        component={MainScreen}
      />
      <Tab.Screen
        name="MainShared"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "folder" : "folder-outline"}
              size={24}
              color={color}
            />
          ),
        }}
        component={MainSharedScreen}
      />
    </Tab.Navigator>
  );
};

const tokenCache: TokenCache = {
  getToken(key: string): Promise<string | null | undefined> {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return Promise.resolve(null);
    }
  },
  saveToken(key: string, value: string): Promise<void> {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return Promise.resolve();
    }
  },

  clearToken(key: string): Promise<void> {
    try {
      return SecureStore.deleteItemAsync(key);
    } catch (err) {
      return Promise.resolve();
    }
  },
};

export const App = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected != null ? state.isConnected : false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [fontsLoaded] = useFonts({
    Poppins_500Medium,
    OpenSans_400Regular,
    OpenSans_700Bold,
    OpenSans_600SemiBold,
  });
  if (!fontsLoaded) {
    return <></>;
  }

  if (!isConnected) {
    return <NoInternetScreen />;
  }

  return (
    <ActionSheetProvider>
      <ClerkProvider
        tokenCache={tokenCache}
        publishableKey={Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY}
      >
        <SignedIn>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="AppStack"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="AppStack" component={AppStack} />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_left",
                }}
                name="Settings"
                component={SettingsScreen}
              />
              {/* Subjects */}
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="AddSubjectScreen"
                component={AddSubjectScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="CreateTopic"
                component={CreateTopicScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="SubjectScreen"
                component={SubjectScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="EditSubjectScreen"
                component={EditSubjectScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="TopicScreen"
                component={TopicScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="EditTopicScreen"
                component={EditTopicScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="FlashcardsScreen"
                component={FlashcardsScreen}
              />
              <Stack.Screen
                options={{
                  headerShown: false,
                  presentation: "modal",
                  animationTypeForReplace: "push",
                  animation: "slide_from_right",
                }}
                name="PrepareFlashcardsScreen"
                component={PrepareFlashcardsScreen}
              />
              <Stack.Screen name="AiErrorScreen" component={AiErrorScreen} />
            </Stack.Navigator>
          </NavigationContainer>
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
    </ActionSheetProvider>
  );
};
